import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { BLM41FerriteBead } from "../lib/BLM41FerriteBead"
test("BLM41FerriteBead outline, connected terminals and explicit component props", async () => {
  for (const footprint of [
    "smdpads2_p3.8999mm_pw2mm_ph2mm",
    "smdpads2_p9mm",
    "smdpads2_p3.8999mm_pw2mm_ph2mm_pin1location(rightside,top)",
  ]) {
    const { geometries } = getComponentModel(BLM41FerriteBead, {
      footprint: footprint,
    })
    expect(geometries).toHaveLength(3)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
    )
    for (const [axis, expected] of [4.5, 1.6, 1.6].entries())
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
  expect(() => BLM41FerriteBead({ footprint: "smdpads3" })).toThrow("two pads")
})
