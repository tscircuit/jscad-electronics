import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { getComponentModel } from "./helpers/component-model"
import { CeramicChipAntenna } from "../lib/CeramicChipAntenna"
test("RFANT body dimensions and connected terminations", async () => {
  const { geometries } = getComponentModel(CeramicChipAntenna, {
    footprint: "smdpads2",
  })
  expect(geometries).toHaveLength(4)
  const b = jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom),
  )
  expect(b[1][0] - b[0][0]).toBeCloseTo(5.2, 4)
  expect(b[1][1] - b[0][1]).toBeCloseTo(2, 4)
  expect(b[1][2]).toBeCloseTo(1.15, 4)
  for (const g of geometries.slice(1))
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(geometries[0]!.geom, g.geom),
      ),
    ).toBeGreaterThan(0)
  expect(() => CeramicChipAntenna({ footprint: "smdpads3" })).toThrow(
    "two pads",
  )
})
