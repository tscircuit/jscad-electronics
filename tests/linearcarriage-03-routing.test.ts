import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  LinearCarriage,
  createLinearCarriageGeom,
  createLinearCarriageMesh,
} from "../lib/models/linearcarriage"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { linearcarriageExample } from "./fixtures/linearcarriage-example"
test("linearcarriage direct React, registered footprint and built vanilla routing agree without pads", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createLinearCarriageMesh()).toEqual(createLinearCarriageMesh())
  const geom = createLinearCarriageGeom()
  const volume = jscad.measurements.measureVolume(geom)
  for (const result of [
    getComponentModel(LinearCarriage, {}),
    getComponentModel(Footprinter3d, { footprint: linearcarriageExample }),
    vanilla.getJscadModelForFootprintWithPads(linearcarriageExample, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(volume, 6)
  }
})
