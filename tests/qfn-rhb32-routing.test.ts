import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { qfnRhb32Footprint } from "../examples/fixtures/qfn-rhb32"
import { importVanilla } from "./fixtures/importVanilla.js"

test("RHB32 footprint routes to its 5 x 5 x 1 mm VQFN outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(qfnRhb32Footprint, jscad).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(5, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(5, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1, 5)
})
