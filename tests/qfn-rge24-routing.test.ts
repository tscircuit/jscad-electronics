import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { qfnRge24Footprint } from "../examples/fixtures/qfn-rge24"
import { importVanilla } from "./fixtures/importVanilla.js"

test("RGE24 footprint routes to its 4 x 4 x 1 mm VQFN outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(qfnRge24Footprint, jscad).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(4, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(4, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1, 5)
})
