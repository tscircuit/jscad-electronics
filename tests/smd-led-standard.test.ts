import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { smdLedDimensions } from "../lib/smdLED"
import { importVanilla } from "./fixtures/importVanilla"

test("standard LEDs route to package-sized bodies with two landed contacts", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const size of ["0402", "0603", "0805"] as const) {
    const dims = smdLedDimensions[size]
    const footprint = `led${size}`
    const pads = fp
      .string(footprint)
      .circuitJson()
      .filter((p) => p.type === "pcb_smtpad" && p.shape === "rect")
    expect(pads).toHaveLength(2)
    const solids = getJscadModelForFootprint(footprint, jscad)
      .geometries.flat(Infinity)
      .map((g) => g.geom)
    expect(solids).toHaveLength(4)
    const b = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [axis, expected] of [
      [0, dims.length],
      [1, dims.width],
      [2, dims.height],
    ] as const)
      expect(b[1][axis] - b[0][axis]).toBeCloseTo(expected, 5)
    expect(b[0][2]).toBeCloseTo(0, 6)
    for (const [i, contact] of solids.slice(1, 3).entries()) {
      const cb = jscad.measurements.measureBoundingBox(contact!)
      const pad = pads[i]!
      expect(cb[0][0]).toBeLessThan(pad.x + pad.width / 2)
      expect(cb[1][0]).toBeGreaterThan(pad.x - pad.width / 2)
    }
  }
})
