import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { SWPA4030Inductor } from "../lib/SWPA4030Inductor"
test("SWPA4030Inductor outline, connected terminals and explicit component props", async () => {
  for (const footprint of [
    "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm",
    "smdpads2_p9mm",
    "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(SWPA4030Inductor, {
      footprint: footprint,
    })
    expect(geometries).toHaveLength(3)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
    )
    for (const [axis, expected] of [4, 4, 3].entries())
      expect(bounds[1][axis]! - bounds[0][axis]!).toBeCloseTo(expected, 4)
    expect(bounds[0][2]).toBeCloseTo(0, 4)
    for (const index of [1, 2])
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(
            geometries[0]!.geom,
            geometries[index]!.geom,
          ),
        ),
      ).toBeGreaterThan(0)
  }
  expect(() => SWPA4030Inductor({ footprint: "smdpads3" })).toThrow("two pads")
})
