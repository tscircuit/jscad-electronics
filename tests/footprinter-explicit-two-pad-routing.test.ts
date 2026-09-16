import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

const packageCases = [
  {
    footprint: "do219ad",
    fn: "do219ad",
    size: [2.5, 1.3, 0.68],
  },
  {
    footprint:
      "sod323he_bodylength2.1mm_bodywidth1.5mm_bodyheight0.8mm_leadspan2.7mm_standoff0.1mm",
    fn: "sod323he",
    size: [2.7, 1.5, 0.8],
  },
  {
    footprint:
      "dfn2_w1.6mm_pl0.6mm_pw0.6mm_bodywidth1mm_bodylength0.6mm_bodythickness0.35mm_standoff0.025mm_terminalinset0.05mm_terminallength0.25mm_terminalwidth0.5mm_terminalpitch0.5mm_terminalthickness0.05mm_pin1terminalchamfer0.03mm_pin1markwidth0.1mm",
    fn: "dfn",
    size: [1, 0.6, 0.375],
  },
] as const

test("explicit two-pad packages select the same React and vanilla models", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()

  for (const { footprint, fn, size } of packageCases) {
    expect(fp.string(footprint).json().fn).toBe(fn)

    const react = getComponentModel(Footprinter3d, {
      footprint,
    }).geometries.map(({ geom }) => geom)
    const vanilla = get(footprint, jscad).geometries.map(
      ({ geom }: { geom: jscad.geometries.geom3.Geom3 }) => geom,
    )

    expect(vanilla).toHaveLength(react.length)
    expect(react.length).toBeGreaterThan(0)

    for (const solids of [react, vanilla]) {
      const [min, max] = jscad.measurements.measureAggregateBoundingBox(
        ...solids,
      )
      expect(max[0] - min[0]).toBeCloseTo(size[0], 5)
      expect(max[1] - min[1]).toBeCloseTo(size[1], 5)
      expect(max[2] - min[2]).toBeCloseTo(size[2], 5)
    }
  }
})

test("generic smdpads2 remains model-agnostic", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const footprint = "smdpads2_p1.84mm_pw1.35mm_ph0.95mm"

  expect(
    getComponentModel(Footprinter3d, { footprint }).geometries,
  ).toHaveLength(0)
  expect(get(footprint, jscad).geometries).toHaveLength(0)
})
