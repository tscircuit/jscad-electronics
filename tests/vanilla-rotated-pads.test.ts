import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import type { RenderResult } from "../lib/vanilla/render"
import { importVanilla } from "./fixtures/importVanilla.js"

for (const footprint of [
  "jst4_sh_pin1location(leftside,top)",
  "sot143_pin1location(leftside,top)",
  "smdslideswitch7_pin1location(leftside,bottom)",
]) {
  test(`vanilla pad bounds match rotated footprint: ${footprint}`, async () => {
    const { getJscadModelForFootprint, getJscadModelForFootprintWithPads } =
      await importVanilla()
    const pads = fp
      .string(footprint)
      .circuitJson()
      .filter((el) => el.type === "pcb_smtpad")
    const bodyCount = getJscadModelForFootprint(footprint, jscad).geometries
      .length
    const meshes = getJscadModelForFootprintWithPads(
      footprint,
      jscad,
    ).geometries.slice(bodyCount)
    expect(pads.length).toBeGreaterThan(0)
    for (const [index, pad] of pads.entries()) {
      if (pad.shape !== "rotated_rect")
        throw new Error("Expected rotated rectangular pad")
      // These fixtures turn the footprint a quarter turn: X/Y extents swap.
      expect(Math.abs(pad.ccw_rotation) % 180).toBe(90)
      const [min, max] = jscad.measurements.measureBoundingBox(
        meshes[index]!.geom,
      )
      expect(max[0] - min[0]).toBeCloseTo(pad.height, 6)
      expect(max[1] - min[1]).toBeCloseTo(pad.width, 6)
      expect((max[0] + min[0]) / 2).toBeCloseTo(pad.x, 6)
      expect((max[1] + min[1]) / 2).toBeCloseTo(pad.y, 6)
    }
  })
}

test("vanilla JST-PH housing sits on the board while pins extend below it", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const { geometries }: RenderResult = getJscadModelForFootprint(
    "jst2_p2mm_ph",
    jscad,
  )
  const housing = geometries.filter(({ color }) => color === "#f5f5f5")
  const pins = geometries.filter(({ color }) => color === "#635959")
  expect(housing).toHaveLength(1)
  expect(pins).toHaveLength(2)
  const [min, max] = jscad.measurements.measureBoundingBox(housing[0]!.geom)
  expect(min[2]).toBeCloseTo(0, 6)
  expect(max[2]).toBeCloseTo(6, 6)
  for (const { geom } of pins) {
    const [pinMin, pinMax] = jscad.measurements.measureBoundingBox(geom)
    expect(pinMin[2]).toBeCloseTo(-3.4, 6)
    expect(pinMax[2]).toBeCloseTo(5.5, 6)
  }
})
