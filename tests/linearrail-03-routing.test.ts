import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  LinearRail,
  createLinearRailGeom,
  createLinearRailMesh,
} from "../lib/models/linearrail"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { linearrailExample } from "./fixtures/linearrail-example"
test("linearrail direct React, registered footprint and built vanilla routing agree without pads", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createLinearRailMesh()).toEqual(createLinearRailMesh())
  const geom = createLinearRailGeom()
  const volume = jscad.measurements.measureVolume(geom)
  for (const result of [
    getComponentModel(LinearRail, {}),
    getComponentModel(Footprinter3d, { footprint: linearrailExample }),
    vanilla.getJscadModelForFootprintWithPads(linearrailExample, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(volume, 6)
  }
})
