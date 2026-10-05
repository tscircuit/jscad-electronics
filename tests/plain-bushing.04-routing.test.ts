import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  PlainBushing,
  createPlainBushingGeom,
  createPlainBushingMesh,
} from "../lib/models/plainbushing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source } from "./fixtures/plain-bushing-cases"

test("plain bushing React, footprint routing and vanilla exports agree and create no pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "plainbushing")
    throw new Error("Expected plain bushing")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  const geometry = createPlainBushingGeom(props)
  expect(vanilla.createPlainBushingMesh(props)).toEqual(
    createPlainBushingMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const results = [
    getComponentModel(PlainBushing, props),
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
