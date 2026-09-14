import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("tantalum cases keep physical dimensions and connected terminations", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const [size, l, w, h] of [
    ["A", 3.2, 1.6, 1.6],
    ["B", 3.5, 2.8, 1.9],
    ["C", 6, 3.2, 2.6],
    ["D", 7.3, 4.3, 2.9],
  ] as const) {
    const { geometries } = get(`smdpads2_tantalum${size}`, jscad)
    expect(geometries).toHaveLength(4)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g) => g.geom),
    )
    expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(l, 3)
    expect(bounds[1][1] - bounds[0][1]).toBeCloseTo(w, 3)
    expect(bounds[1][2]).toBeCloseTo(h, 1)
    for (const g of geometries.slice(1, 3))
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(geometries[0]!.geom, g.geom),
        ),
      ).toBeGreaterThan(0)
  }
  expect(get("smdpads2", jscad).geometries).toHaveLength(0)
  expect(() => get("smdpads3_tantalumA", jscad)).toThrow("two pads")
})
