import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { B3UTactileSwitch } from "../lib/B3UTactileSwitch"
test("B3UTactileSwitch outline, connected terminals and explicit component props", async () => {
  for (const footprint of [
    "smdpads2_p3.4mm_pw0.8mm_ph1.7mm",
    "smdpads2_p9mm",
    "smdpads2_p3.4mm_pw0.8mm_ph1.7mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(B3UTactileSwitch, {
      footprint: footprint,
    })
    expect(geometries).toHaveLength(7)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
    )
    for (const [axis, expected] of [4, 2.5, 1.6].entries())
      expect(bounds[1][axis]! - bounds[0][axis]!).toBeCloseTo(expected, 4)
    expect(bounds[0][2]).toBeCloseTo(0, 4)
    for (const index of [3, 4])
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(
            geometries[0]!.geom,
            geometries[index]!.geom,
          ),
        ),
      ).toBeGreaterThan(0)
  }
  expect(() => B3UTactileSwitch({ footprint: "smdpads3" })).toThrow("two pads")
})
