import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { powerDfn5x6Footprint } from "../examples/fixtures/power-dfn5x6"
import { importVanilla } from "./fixtures/importVanilla.js"

test("power DFN footprint routes to the 5.1 x 6.1 x 1 mm outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(
    powerDfn5x6Footprint,
    jscad,
  ).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(6.1, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(5.1, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1, 5)

  const exposedPad = solids[9]!.geom
  const [padLo, padHi] = jscad.measurements.measureBoundingBox(exposedPad)
  expect((padLo[0] + padHi[0]) / 2).toBeCloseTo(0.695, 5)
})
