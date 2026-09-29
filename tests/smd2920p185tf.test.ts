import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { Smd2920P185TF } from "../lib/Smd2920P185TF"
import { getComponentModel } from "./helpers/component-model"

test("SMD2920P185TF body and terminals align with its two pads", () => {
  const footprint = "smdpads2_p6.5999mm_pw2mm_ph5.3mm_cyw9.6948mm_cyh6.2912mm"
  const solids = getComponentModel(Smd2920P185TF, { footprint }).geometries.map(
    ({ geom }) => geom,
  )
  expect(solids).toHaveLength(3)

  const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
  expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(7.36, 4)
  expect(bounds[1][1] - bounds[0][1]).toBeCloseTo(5.12, 4)
  expect(bounds[1][2] - bounds[0][2]).toBeCloseTo(0.7, 4)
  expect(bounds[0][2]).toBeCloseTo(0, 5)

  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter((item) => item.type === "pcb_smtpad" && item.shape === "rect")
    .sort((a, b) => a.x - b.x)
  expect(pads).toHaveLength(2)
  for (const [i, terminal] of solids.slice(1).entries()) {
    const terminalBounds = jscad.measurements.measureBoundingBox(terminal!)
    const pad = pads[i]!
    expect(terminalBounds[0][0]).toBeLessThan(pad.x + pad.width / 2)
    expect(terminalBounds[1][0]).toBeGreaterThan(pad.x - pad.width / 2)
  }
})
