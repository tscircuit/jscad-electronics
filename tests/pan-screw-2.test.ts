import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { PanScrew, createPanScrewGeom } from "../lib/models/panscrew"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("panscrew React, vanilla and footprint dispatch", async () => {
  const source = "panscrew_m3_l10mm_drive(phillips)"
  const definition = mp.string(source).json()
  if (definition.fn !== "panscrew") throw new Error("Wrong family")
  const explicitSource = source + "_iso7045"
  expect(mp.string(explicitSource.toUpperCase()).json()).toEqual(definition)
  expect(definition.iso7045).toBe(true)
  expect(definition.iso4757).toBe(true)
  expect(mp.string(source + "_ISO4757").json()).toEqual(definition)
  const { fn, ...props } = definition
  const geom = createPanScrewGeom(props)
  jscad.geometries.geom3.validate(geom)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const vanilla = await importVanilla()
  for (const result of [
    getComponentModel(PanScrew, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    getComponentModel(Footprinter3d, { footprint: explicitSource }),
    getComponentModel(Footprinter3d, { footprint: source + "_iso4757" }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
    vanilla.getJscadModelForFootprintWithPads(explicitSource, jscad),
    vanilla.getJscadModelForFootprintWithPads(source + "_iso4757", jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(solid.polygons).toEqual(geom.polygons)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(bounds)
    expect(jscad.measurements.measureVolume(solid)).toBeGreaterThan(0)
  }
}, 30000)
