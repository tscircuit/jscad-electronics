import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("MF2410Fuse outline, connected terminals and explicit routing", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const footprint of [
    "smdpads2_p4.9997mm_pw2mm_ph3.2mm_fuseMF2410",
    "smdpads2_p9mm_fuseMF2410",
    "smdpads2_p4.9997mm_pw2mm_ph3.2mm_fuseMF2410_pin1location(rightside,top)",
  ]) {
    const { geometries } = get(footprint, jscad)
    expect(geometries).toHaveLength(7)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
    )
    for (const [axis, expected] of [6.1, 2.49, 2.16].entries())
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
  expect(() => get("smdpads3_fuseMF2410", jscad)).toThrow("two pads")
  expect(get("smdpads2_fuseMF2410unknown", jscad).geometries).toHaveLength(0)
})
