import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { X1SON2 } from "../lib/X1SON2"
test("X1SON2 physical outline, connected terminals and placement independence", () => {
  for (const footprint of [
    "smdpads2_p1mm_pw0.6mm_ph0.6mm",
    "smdpads2_p9mm",
    "smdpads2_p1mm_pw0.6mm_ph0.6mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(X1SON2, { footprint })
    expect(geometries.length).toBe(4)
    const solids = geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, expected] of [1, 0.6, 0.376].entries())
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
  expect(() => X1SON2({ footprint: "smdpads3" })).toThrow("two pads")
})
