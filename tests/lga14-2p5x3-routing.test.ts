import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { lga14_2p5x3Footprint } from "../examples/fixtures/lga14-2p5x3"
import { importVanilla } from "./fixtures/importVanilla.js"

test("LGA-14 footprint routes to the 2.5 x 3 x 0.86 mm outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(
    lga14_2p5x3Footprint,
    jscad,
  ).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(3, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(2.5, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(0.86, 5)
  expect(solids).toHaveLength(15)
})
