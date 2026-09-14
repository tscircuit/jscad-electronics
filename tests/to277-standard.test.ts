import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { TO277 } from "../lib/TO277"
import { to277StandardVariants } from "../examples/fixtures/to277-standard-variants"
import { getComponentModel } from "./helpers/component-model"
test("TO277: dimensions, connected terminals and isolation", () => {
  const v = Object.values(to277StandardVariants)[0]!,
    p = v.props
  const pads = fp
    .string(v.footprint)
    .circuitJson()
    .filter((p) => p.type === "pcb_smtpad")
  expect(pads.length).toBe(3)
  for (const pad of pads) expect(pad.shape).toBe("rect")
  const solids = getComponentModel(TO277, p).geometries.map((g) => g.geom)
  expect(solids.length).toBe(4)
  const b = jscad.measurements.measureAggregateBoundingBox(...solids)
  for (const [i, v] of [6.5, 4.6, 1.1].entries())
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
  expect(() => TO277({ ...p, bodyHeight: NaN })).toThrow()
  expect(() => TO277({ ...p, ...{ leadLength: 4 } })).toThrow()
})
