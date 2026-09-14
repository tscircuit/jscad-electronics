import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { MelfResistor } from "../lib/MelfResistor"
test("MELF resistor dimensions, cylindrical volume and connected end caps", async () => {
  for (const [size, l, d] of [
    ["0102", 2.2, 1.1],
    ["0204", 3.6, 1.4],
    ["0207", 5.8, 2.2],
  ] as const) {
    const { geometries } = getComponentModel(MelfResistor, {
      footprint: "smdpads2",
      size: size,
    })
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
})
