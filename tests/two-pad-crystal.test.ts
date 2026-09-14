import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("two-pad crystal dimensions and connected terminal/base/lid geometry", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const [name, l, w, h] of [
    ["FC135", 3.2, 1.5, 0.9],
    ["FC12M", 2.05, 1.2, 0.6],
    ["FC1610AN", 1.65, 1.05, 0.5],
    ["NX3225GD", 3.2, 2.5, 0.8],
  ] as const) {
    const { geometries } = get(`smdpads2_crystal2${name}`, jscad)
    expect(geometries).toHaveLength(4)
    const b = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
    )
    expect(b[1][0] - b[0][0]).toBeCloseTo(l, 4)
    expect(b[1][1] - b[0][1]).toBeCloseTo(w, 4)
    expect(b[1][2]).toBeCloseTo(h, 4)
    for (const g of geometries.slice(1))
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(geometries[0]!.geom, g.geom),
        ),
      ).toBeGreaterThan(0)
  }
  expect(() => get("smdpads3_crystal2FC135", jscad)).toThrow("two pads")
  expect(get("smdpads2", jscad).geometries).toHaveLength(0)
})
