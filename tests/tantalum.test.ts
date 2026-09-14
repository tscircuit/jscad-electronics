import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { TantalumCapacitor } from "../lib/TantalumCapacitor"
test("tantalum cases keep physical dimensions and connected terminations", async () => {
  for (const [size, l, w, h] of [
    ["A", 3.2, 1.6, 1.6],
    ["B", 3.5, 2.8, 1.9],
    ["C", 6, 3.2, 2.6],
    ["D", 7.3, 4.3, 2.9],
  ] as const) {
    const { geometries } = getComponentModel(TantalumCapacitor, {
      footprint: "smdpads2",
      caseSize: size,
    })
    expect(geometries).toHaveLength(4)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
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
})
