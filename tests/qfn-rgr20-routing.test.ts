import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { qfnRgr20Footprint } from "../examples/fixtures/qfn-rgr20"
import { importVanilla } from "./fixtures/importVanilla.js"

test("RGR20 footprint routes to its 3.5 x 3.5 x 1 mm VQFN outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(qfnRgr20Footprint, jscad).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(3.5, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(3.5, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1, 5)
})
