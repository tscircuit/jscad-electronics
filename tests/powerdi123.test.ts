import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { PowerDI123 } from "../lib/PowerDI123"
test("PowerDI123 physical outline, connected terminals and placement independence", () => {
  for (const footprint of [
    "diode_p2.3749mm_pw1.725mm_ph1.5mm_rounded0",
    "smdpads2_p9mm",
    "diode_p2.3749mm_pw1.725mm_ph1.5mm_rounded0_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(PowerDI123, { footprint })
    expect(geometries.length).toBe(4)
    const solids = geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, expected] of [3.7, 1.78, 0.981].entries())
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
  expect(() => PowerDI123({ footprint: "smdpads3" })).toThrow("two pads")
})
