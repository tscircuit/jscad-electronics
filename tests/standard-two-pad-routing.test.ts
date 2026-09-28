import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

const boundsOf = (geometries: Array<{ geom: any }>) =>
  jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map(({ geom }) => geom),
  )

test("explicit diode packages select their physical outlines and dimensions", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const [footprint, width, length, height] of [
    ["do219ad", 2.5, 1.3, 0.68],
    ["sod-323he", 2.5, 1.4, 0.6],
    ["sod323he_bodywidth1.5mm_bodyheight0.8mm_leadspan2.7mm", 2.7, 1.5, 0.8],
  ] as const) {
    const geometries = get(footprint, jscad).geometries
    expect(geometries.length).toBe(4)
    const react = getComponentModel(Footprinter3d, { footprint }).geometries
    expect(react.length).toBe(geometries.length)
    const bounds = boundsOf(geometries)
    const reactBounds = boundsOf(react)
    for (const [axis, expected] of [width, length, height].entries())
      expect(bounds[1][axis]! - bounds[0][axis]!).toBeCloseTo(expected, 5)
    for (const axis of [0, 1, 2])
      expect(reactBounds[1][axis]! - reactBounds[0][axis]!).toBeCloseTo(
        bounds[1][axis]! - bounds[0][axis]!,
        5,
      )
    expect(bounds[0][2]).toBeCloseTo(0, 5)
  }

  const reversed = get("do219ad_anodepin1_cathodepin2", jscad).geometries
  const cathode = jscad.measurements.measureBoundingBox(reversed[1]!.geom)
  expect((cathode[0][0] + cathode[1][0]) / 2).toBeGreaterThan(0)
})

test("explicit DFN2 dimensions select the rectangular physical outline", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const footprint =
    "dfn2_w1.6mm_pl0.6mm_pw0.6mm_bodywidth1mm_bodylength0.6mm_bodythickness0.35mm_standoff0.025mm_terminalinset0.05mm_terminallength0.25mm_terminalwidth0.5mm_terminalpitch0.5mm_terminalthickness0.05mm_pin1terminalchamfer0.03mm_pin1markwidth0.1mm"
  const geometries = get(footprint, jscad).geometries
  expect(geometries.length).toBe(4)
  expect(
    getComponentModel(Footprinter3d, { footprint }).geometries,
  ).toHaveLength(geometries.length)
  const bounds = boundsOf(geometries)
  for (const [axis, expected] of [1, 0.6, 0.375].entries())
    expect(bounds[1][axis]! - bounds[0][axis]!).toBeCloseTo(expected, 5)
  expect(bounds[0][2]).toBeCloseTo(0, 5)
  expect(
    get("smdpads2_p1.84mm_pw1.35mm_ph0.95mm", jscad).geometries,
  ).toHaveLength(0)
  expect(
    getComponentModel(Footprinter3d, {
      footprint: "smdpads2_p1.84mm_pw1.35mm_ph0.95mm",
    }).geometries,
  ).toHaveLength(0)
})
