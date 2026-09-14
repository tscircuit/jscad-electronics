import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { TUMD2SM } from "../lib/TUMD2SM"
test("TUMD2SM physical outline, connected terminals and placement independence", () => {
  for (const footprint of [
    "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm",
    "smdpads2_p9mm",
    "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(TUMD2SM, { footprint })
    expect(geometries.length).toBe(4)
    const solids = geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, expected] of [2.5, 1.4, 0.601].entries())
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
  expect(() => TUMD2SM({ footprint: "smdpads3" })).toThrow("two pads")
})
