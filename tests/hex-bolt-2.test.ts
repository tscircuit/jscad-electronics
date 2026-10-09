import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { HexBolt, createHexBoltGeom } from "../lib/models/hexbolt"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("hexbolt React, vanilla and footprint dispatch", async () => {
  const source = "hexbolt_m6_l25mm_thread(full)_drive(hex)"
  const definition = mp.string(source).json()
  if (definition.fn !== "hexbolt") throw new Error("Wrong family")
  const explicitSource = source + "_iso4017"
  expect(mp.string(explicitSource.toUpperCase()).json()).toEqual(definition)
  expect(definition.iso4017).toBe(true)
  const { fn, ...props } = definition
  const geom = createHexBoltGeom(props)
  jscad.geometries.geom3.validate(geom)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const vanilla = await importVanilla()
  for (const result of [
    getComponentModel(HexBolt, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    getComponentModel(Footprinter3d, { footprint: explicitSource }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
    vanilla.getJscadModelForFootprintWithPads(explicitSource, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(solid.polygons).toEqual(geom.polygons)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(bounds)
    expect(jscad.measurements.measureVolume(solid)).toBeGreaterThan(0)
  }
}, 30000)
