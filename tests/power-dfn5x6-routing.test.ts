import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { powerDfn5x6Footprint } from "../examples/fixtures/power-dfn5x6"
import { importVanilla } from "./fixtures/importVanilla.js"

test("power DFN footprint follows the footprint pad-row orientation", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(
    powerDfn5x6Footprint,
    jscad,
  ).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(5.1, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(6.1, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1, 5)

  const terminal1 = solids[1]!.geom
  const [terminalLo, terminalHi] =
    jscad.measurements.measureBoundingBox(terminal1)
  expect((terminalLo[0] + terminalHi[0]) / 2).toBeCloseTo(-1.905, 5)
  expect((terminalLo[1] + terminalHi[1]) / 2).toBeCloseTo(-2.51, 5)

  const exposedPad = solids[9]!.geom
  const [padLo, padHi] = jscad.measurements.measureBoundingBox(exposedPad)
  expect((padLo[0] + padHi[0]) / 2).toBeCloseTo(0, 5)
  expect((padLo[1] + padHi[1]) / 2).toBeCloseTo(0.695, 5)
})
