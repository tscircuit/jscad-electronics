import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

test("C68883 standard SOD-80 footprint generates the MiniMELF outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const { geometries } = getJscadModelForFootprint(
    "sod80_p3.5301mm_pl1.44mm_pw1.62mm",
    jscad,
  )
  expect(geometries).toHaveLength(4)
  const [min, max] = jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map(
      ({ geom }: { geom: jscad.geometries.geom3.Geom3 }) => geom,
    ),
  )
  expect(max[0] - min[0]).toBeCloseTo(3.5, 5)
  expect(max[2] - min[2]).toBeCloseTo(1.54, 5)
})
