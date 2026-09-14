import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { MFSM075ResettableFuse } from "../lib/MFSM075ResettableFuse"
test("MFSM075ResettableFuse physical outline, connected terminals and placement independence", () => {
  for (const footprint of [
    "smdpads2_p7.0825mm_pw1.5mm_ph3.1mm_cyw9.0852mm_cyh6.1896mm",
    "smdpads2_p9mm",
    "smdpads2_p7.0825mm_pw1.5mm_ph3.1mm_cyw9.0852mm_cyh6.1896mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(MFSM075ResettableFuse, {
      footprint,
    })
    expect(geometries.length).toBe(3)
    const solids = geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, expected] of [7.355, 5.44, 3.18].entries())
      expect(bounds[1][axis]! - bounds[0][axis]!).toBeCloseTo(expected, 4)
    expect(bounds[0][2]).toBeCloseTo(0, 4)
    for (const solid of solids)
      expect(jscad.measurements.measureVolume(solid)).toBeGreaterThan(0)
    for (const terminal of solids.slice(1, 3))
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[0]!, terminal),
        ),
      ).toBeGreaterThan(0)
  }
  expect(() => MFSM075ResettableFuse({ footprint: "smdpads3" })).toThrow(
    "two pads",
  )
})
