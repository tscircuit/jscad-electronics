import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { importVanilla } from "./fixtures/importVanilla"

test("WS2812B-4020 opt-in model has a side window and four seated contacts", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const footprint = "smdpads4_pin1location(rightside,top)"
  expect(getJscadModelForFootprint(footprint, jscad).geometries).toHaveLength(0)

  const solids: jscad.geometries.geom3.Geom3[] = getJscadModelForFootprint(
    footprint,
    jscad,
    { model: "ws2812b4020" },
  ).geometries.map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom)
  expect(solids).toHaveLength(6)

  const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
  expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(3.98, 4)
  expect(bounds[1][1] - bounds[0][1]).toBeCloseTo(1.71, 4)
  expect(bounds[1][2] - bounds[0][2]).toBeCloseTo(2, 4)
  expect(bounds[0][2]).toBeCloseTo(0, 5)

  const centers = solids.slice(1, 5).map((contact) => {
    const b = jscad.measurements.measureBoundingBox(contact!)
    expect(b[0][2]).toBeCloseTo(0, 5)
    expect(b[1][2]).toBeCloseTo(0.13, 5)
    return (b[0][0] + b[1][0]) / 2
  })
  for (const [index, x] of [-1.275, -0.425, 0.425, 1.275].entries())
    expect(centers[index]).toBeCloseTo(x, 5)

  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (item) =>
        item.type === "pcb_smtpad" &&
        (item.shape === "rect" || item.shape === "rotated_rect"),
    )
    .sort((a, b) => a.x - b.x)
  expect(pads).toHaveLength(4)
  for (const [index, contact] of solids.slice(1, 5).entries()) {
    const b = jscad.measurements.measureBoundingBox(contact!)
    const pad = pads[index]!
    expect(b[0][0]).toBeLessThan(pad.x + pad.width / 2)
    expect(b[1][0]).toBeGreaterThan(pad.x - pad.width / 2)
    expect(b[0][1]).toBeLessThan(pad.y + pad.height / 2)
    expect(b[1][1]).toBeGreaterThan(pad.y - pad.height / 2)
  }
})
