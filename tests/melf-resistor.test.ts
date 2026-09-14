import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("MELF resistor dimensions, cylindrical volume and connected end caps", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const [size, l, d] of [
    ["0102", 2.2, 1.1],
    ["0204", 3.6, 1.4],
    ["0207", 5.8, 2.2],
  ] as const) {
    const { geometries } = get(`smdpads2_melfresistor${size}`, jscad)
    expect(geometries).toHaveLength(3)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
    )
    expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(l, 4)
    expect(bounds[1][2]).toBeCloseTo(d, 4)
    expect(bounds[0][2]).toBeCloseTo(0, 4)
    for (const g of geometries.slice(1))
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(geometries[0]!.geom, g.geom),
        ),
      ).toBeGreaterThan(0)
  }
  expect(get("smdpads2", jscad).geometries).toHaveLength(0)
  expect(() => get("smdpads3_melfresistor0204", jscad)).toThrow("two pads")
})
