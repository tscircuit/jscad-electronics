import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  FlangedBushing,
  createFlangedBushingGeom,
  createFlangedBushingMesh,
} from "../lib/models/flangedbushing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source } from "./fixtures/flanged-bushing-cases"

test("flanged bushing React, footprint routing and vanilla exports agree without PCB pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "flangedbushing")
    throw new Error("Expected flanged bushing")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  const geometry = createFlangedBushingGeom(props)
  expect(vanilla.createFlangedBushingMesh(props)).toEqual(
    createFlangedBushingMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const results = [
    getComponentModel(FlangedBushing, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]
  for (const result of results) {
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
