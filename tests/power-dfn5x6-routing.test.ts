import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { powerDfn5x6Footprint } from "../examples/fixtures/power-dfn5x6"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getSmtPadRects } from "../lib/utils/getSmtPadRects"

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

test("generic DFN follows Footprinter pin1location transforms", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const base =
    "dfn8_thermalpad1.2mmx1.8mm_thermalpadcenteroffsetx0.2mm_w5.3mm_pw0.6mm_pl1mm"
  const cases = [
    ["leftside,top", -2.15, 1.905, 0.2, 0],
    ["leftside,bottom", -1.905, -2.15, 0, 0.2],
    ["rightside,bottom", 2.15, -1.905, -0.2, 0],
    ["rightside,top", 1.905, 2.15, 0, -0.2],
  ] as const

  for (const [pin1location, terminalX, terminalY, padX, padY] of cases) {
    const footprint = `${base}_pin1location(${pin1location})`
    const pads = getSmtPadRects(footprint, { includeRotated: true })
    expect(pads).toHaveLength(9)
    expect(pads[0]!.pin).toBe("1")
    expect(pads[0]!.x).toBeCloseTo(terminalX, 5)
    expect(pads[0]!.y).toBeCloseTo(terminalY, 5)

    const solids = getJscadModelForFootprint(footprint, jscad).geometries
    const [terminalLo, terminalHi] = jscad.measurements.measureBoundingBox(
      solids[1]!.geom,
    )
    expect((terminalLo[0] + terminalHi[0]) / 2).toBeCloseTo(terminalX, 5)
    expect((terminalLo[1] + terminalHi[1]) / 2).toBeCloseTo(terminalY, 5)

    const [padLo, padHi] = jscad.measurements.measureBoundingBox(
      solids[9]!.geom,
    )
    expect((padLo[0] + padHi[0]) / 2).toBeCloseTo(padX, 5)
    expect((padLo[1] + padHi[1]) / 2).toBeCloseTo(padY, 5)
  }
})
