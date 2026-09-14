import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { SSOP } from "../lib/SSOP"
import { createDualRowGullWing } from "../lib/utils/DualRowGullWing"
import { ssopStandardVariants } from "../examples/fixtures/ssop-standard-variants"
import { getComponentModel } from "./helpers/component-model"
test("SSOP: dimensions, connected terminals and isolation", () => {
  const v = Object.values(ssopStandardVariants)[0]!,
    p = v.props
  const pads = fp
    .string(v.footprint)
    .circuitJson()
    .filter((p) => p.type === "pcb_smtpad")
  expect(pads.length).toBe(28)
  for (const pad of pads) expect(pad.shape).toBe("rect")
  const solids = getComponentModel(SSOP, p).geometries.map((g) => g.geom)
  expect(solids.length).toBe(29)
  const b = jscad.measurements.measureAggregateBoundingBox(...solids)
  for (const [i, v] of [7.8, 10.2, 1.85].entries())
    expect(b[1][i]! - b[0][i]!).toBeCloseTo(v, 5)
  expect(b[0][2]).toBeCloseTo(0, 6)
  for (let i = 1; i < solids.length; i++) {
    expect(jscad.measurements.measureVolume(solids[i]!)).toBeGreaterThan(0)
    expect(jscad.measurements.measureBoundingBox(solids[i]!)[0][2]).toBeCloseTo(
      0,
      6,
    )
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(solids[0]!, solids[i]!),
      ),
    ).toBeGreaterThan(0)
    for (let k = i + 1; k < solids.length; k++)
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[i]!, solids[k]!),
        ),
      ).toBeCloseTo(0, 8)
  }
  expect(() => createDualRowGullWing({ ...p, bodyHeight: NaN })).toThrow()
  expect(() => createDualRowGullWing({ ...p, ...{ leadSpan: 5 } })).toThrow()
})
