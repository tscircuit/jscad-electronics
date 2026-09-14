import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { MicroSMP } from "../lib/MicroSMP"
test("MicroSMP physical outline, connected terminals and placement independence", () => {
  for (const footprint of [
    "smdpads2_p1.84mm_pw1.35mm_ph0.95mm",
    "smdpads2_p9mm",
    "smdpads2_p1.84mm_pw1.35mm_ph0.95mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(MicroSMP, { footprint })
    expect(geometries.length).toBe(4)
    const solids = geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, expected] of [2.5, 1.3, 0.681].entries())
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
  expect(() => MicroSMP({ footprint: "smdpads3" })).toThrow("two pads")
})
