import { test, expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { createPhysicalLqfp } from "../lib/utils/PhysicalLqfp"
import { LQFP } from "../lib/lqfp"
import { lqfpPhysicalVariants } from "../examples/fixtures/lqfp-physical-variants"
import { getComponentModel } from "./helpers/component-model"
import { fp } from "@tscircuit/footprinter"
test("LQFP: physical outline, pitch, seating plane and embedded leads", () => {
  for (const { props: p, footprint } of Object.values(lqfpPhysicalVariants)) {
    expect(
      fp
        .string(footprint)
        .circuitJson()
        .filter((p) => p.type === "pcb_smtpad").length,
    ).toBeGreaterThanOrEqual(p.pinCount)
    const solids = getComponentModel(LQFP, p).geometries.map((g) => g.geom)
    const box = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, value] of [
      p.leadSpanX,
      p.leadSpanY,
      p.bodyHeight,
    ].entries())
      expect(box[1][axis]! - box[0][axis]!).toBeCloseTo(value, 5)
    expect(box[0][2]).toBeCloseTo(0, 5)
    expect(solids.length).toBe(
      p.pinCount + 1 + ("exposedPadWidth" in p ? 1 : 0),
    )
    for (let i = 1; i <= p.pinCount; i++) {
      const lead = solids[i]!
      expect(jscad.measurements.measureVolume(lead)).toBeGreaterThan(0)
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[0]!, lead),
        ),
      ).toBeGreaterThan(0)
      const b = jscad.measurements.measureBoundingBox(lead)
      expect(b[0][2]).toBeCloseTo(0, 5)
      const axis = Math.floor((i - 1) / (p.pinCount / 4)) % 2 === 0 ? 1 : 0
      expect(b[1][axis]! - b[0][axis]!).toBeCloseTo(p.leadWidth, 5)
      if (i < p.pinCount / 4) {
        const next = jscad.measurements.measureBoundingBox(solids[i + 1]!)
        expect(b[0][1] - next[0][1]).toBeCloseTo(p.pitch, 5)
      }
    }
    if ("exposedPadWidth" in p) {
      const pad = solids.at(-1)!
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[0]!, pad),
        ),
      ).toBeGreaterThan(0)
    }
  }
  const p = Object.values(lqfpPhysicalVariants)[0]!.props
  for (const bad of [
    { pinCount: 10 },
    { pitch: Infinity },
    { standoff: -1 },
    { bodyHeight: 0.2 },
    { leadSpanX: 7 },
    { leadSpanY: 7 },
    { leadWidth: 1 },
    { contactLength: 2 },
    { taperInset: 4 },
  ])
    expect(() => createPhysicalLqfp({ ...p, ...bad })).toThrow()
})
