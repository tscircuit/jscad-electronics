import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { SOT89, sot89NominalDimensions } from "../lib/SOT89"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
function metrics(solids: jscad.geometries.geom3.Geom3[]) {
  return {
    count: solids.length,
    box: jscad.measurements.measureAggregateBoundingBox(...solids),
    volumes: solids.map((s) => jscad.measurements.measureVolume(s)),
  }
}
test("nominal sot89 uses the three-terminal model, including customized copper", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const expected = metrics(
    getComponentModel(SOT89, sot89NominalDimensions).geometries.map(
      (g) => g.geom,
    ),
  )
  for (const footprint of ["sot89", "sot89_p1.5mm_pw0.67mm_pl1.56mm"]) {
    const solids = get(footprint, jscad).geometries.map((g: any) => g.geom)
    expect(solids.length).toBe(expected.count)
    const box = metrics(solids).box
    for (let axis = 0; axis < 3; axis++)
      expect(box[1][axis]! - box[0][axis]!).toBeCloseTo(
        expected.box[1][axis]! - expected.box[0][axis]!,
        5,
      )
  }
  expect(get("sot89_5", jscad).geometries.length).toBeGreaterThan(0)
})
