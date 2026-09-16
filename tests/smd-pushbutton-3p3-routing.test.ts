import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { smdPushbutton3p3Footprint } from "../examples/fixtures/smd-pushbutton-3p3"
import { importVanilla } from "./fixtures/importVanilla.js"

test("3.3 mm tactile footprint routes to its physical switch outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(
    smdPushbutton3p3Footprint,
    jscad,
  ).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(4, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(3.4, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1.5, 5)
  expect(solids).toHaveLength(6)
})
