import { test, expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { MSOP } from "../lib/MSOP"
import { msopVariants } from "../examples/fixtures/msop-variants"
import { getComponentModel } from "./helpers/component-model"
import { fp } from "@tscircuit/footprinter"
test("MSOP: physical outline, pitch, seating plane and embedded leads", () => {
  for (const { props: p, footprint } of Object.values(msopVariants)) {
    expect(
      fp
        .string(footprint)
        .circuitJson()
        .filter((p) => p.type === "pcb_smtpad").length,
    ).toBeGreaterThanOrEqual(p.pinCount)
    // The fixture pad renderer supports rectangular pads; reject silently missing
    // pill-pad previews as well as unknown footprint syntax.
    for (const pad of fp
      .string(footprint)
      .circuitJson()
      .filter((p) => p.type === "pcb_smtpad"))
      expect(["rect", "rotated_rect"].includes(pad.shape)).toBe(true)
    const solids = getComponentModel(MSOP, p).geometries.map((g) => g.geom)
    const box = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, value] of [
      p.leadSpan,
      p.bodyLength,
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
      expect(b[1][1] - b[0][1]).toBeCloseTo(p.leadWidth, 5)
      if (i < p.pinCount / 2) {
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
})
