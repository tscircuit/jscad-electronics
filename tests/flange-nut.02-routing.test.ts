import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  FlangeNut,
  createFlangeNutGeom,
  createFlangeNutMesh,
} from "../lib/models/flangenut"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { flangeNutModelString } from "./fixtures/flange-nut-case"

test("flange nut routes equally through React, footprint and vanilla with no pads", async () => {
  const model = mp.string(flangeNutModelString).json()
  if (model.fn !== "flangenut") throw new Error("Expected flange nut")
  const { fn, ...props } = model
  const vanilla = await importVanilla()
  const geometry = createFlangeNutGeom(props)
  expect(vanilla.createFlangeNutMesh(props)).toEqual(createFlangeNutMesh(props))
  expect(ExtrudedPads({ footprint: flangeNutModelString })).toBeNull()
  for (const result of [
    getComponentModel(FlangeNut, props),
    getComponentModel(Footprinter3d, { footprint: flangeNutModelString }),
    vanilla.getJscadModelForFootprintWithPads(flangeNutModelString, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      6,
    )
  }
})
