import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { HexBolt, createHexBoltGeom } from "../lib/HexBolt"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("hexbolt React, vanilla and footprint dispatch", async () => {
  const source = "hexbolt_standard(iso4017)_m6_l25mm_thread(full)_drive(hex)"
  const definition = mp.string(source).json()
  if (definition.fn !== "hexbolt") throw new Error("Wrong family")
  const { fn, ...props } = definition
  const geom = createHexBoltGeom(props)
  jscad.geometries.geom3.validate(geom)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const vanilla = await importVanilla()
  for (const result of [
    getComponentModel(HexBolt, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(bounds)
    expect(jscad.measurements.measureVolume(solid)).toBeGreaterThan(0)
  }
})
