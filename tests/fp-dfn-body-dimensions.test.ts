import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("captures DFN body dimensions through React and vanilla Footprinter adapters", async () => {
  const footprint = "dfn6_w3mm_h2mm_bodywidth2mm_bodylength1.6mm_p0.5mm"
  expect(fp.string(footprint).json()).toMatchObject({
    w: 3,
    bodywidth: 2,
    bodylength: 1.6,
  })
  const { getJscadModelForFootprint } = await importVanilla()
  const reactModel = getComponentModel(Footprinter3d, { footprint })
  const vanillaModel = getJscadModelForFootprint(footprint, jscad)

  for (const model of [reactModel, vanillaModel]) {
    const [minimum, maximum] = jscad.measurements.measureBoundingBox(
      model.geometries[0]!.geom,
    )
    expect({
      bodyWidthMm: Number((maximum[0] - minimum[0]).toFixed(3)),
      bodyLengthMm: Number((maximum[1] - minimum[1]).toFixed(3)),
    }).toMatchInlineSnapshot(`
      {
        "bodyLengthMm": 5.3,
        "bodyWidthMm": 3,
      }
    `)
  }
})
