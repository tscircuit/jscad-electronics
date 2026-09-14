import { test, expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { createPhysicalQfn } from "../lib/utils/PhysicalQfn"
import { QFN } from "../lib/qfn"
import { qfnPhysicalVariants } from "../examples/fixtures/qfn-physical-variants"
import { getComponentModel } from "./helpers/component-model"
import { fp } from "@tscircuit/footprinter"
test("QFN physical dimensions, terminal placement and exposed-pad isolation", () => {
  for (const { props: p, footprint } of Object.values(qfnPhysicalVariants)) {
    const pads = fp
      .string(footprint)
      .circuitJson()
      .filter((p) => p.type === "pcb_smtpad")
    expect(pads.length).toBe(p.num_pins + 1)
    for (const pad of pads) expect(pad.shape).toBe("rect")
    const solids = getComponentModel(QFN, p).geometries.map((g) => g.geom)
    expect(solids.length).toBe(p.num_pins + 2)
    const box = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [i, v] of [
      p.terminalSpanX,
      p.terminalSpanY,
      p.bodyHeight,
    ].entries())
      expect(box[1][i]! - box[0][i]!).toBeCloseTo(v, 5)
    expect(box[0][2]).toBeCloseTo(0, 5)
    const exposed = solids.at(-1)!
    for (let i = 1; i <= p.num_pins; i++) {
      const lead = solids[i]!
      const b = jscad.measurements.measureBoundingBox(lead)
      expect(b[0][2]).toBeCloseTo(0, 5)
      expect(b[1][2]).toBeCloseTo(p.terminalThickness, 5)
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[0]!, lead),
        ),
      ).toBeGreaterThan(0)
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(exposed, lead),
        ),
      ).toBeCloseTo(0, 8)
      for (let j = i + 1; j <= p.num_pins; j++)
        expect(
          jscad.measurements.measureVolume(
            jscad.booleans.intersect(lead, solids[j]!),
          ),
        ).toBeCloseTo(0, 8)
    }
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(solids[0]!, exposed),
      ),
    ).toBeGreaterThan(0)
  }
  const p = Object.values(qfnPhysicalVariants)[0]!.props
  for (const bad of [
    { num_pins: 10 },
    { pitch: NaN },
    { bodyHeight: 0.1 },
    { terminalThickness: 0.01 },
    { terminalSpanX: 8 },
    { exposedPadWidth: 4 },
    { padLength: 1.5 },
    { padWidth: 1 },
    { topInset: 3 },
    { standoff: -1 },
  ])
    expect(() => createPhysicalQfn({ ...p, ...bad })).toThrow()
})
