import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  AdhesiveMountElectricalComponentHeatsink,
  createAdhesiveMountElectricalComponentHeatsinkGeom,
} from "../lib/models/adhesivemountelectricalcomponentheatsink"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"
import {
  standardString,
  compactString,
} from "./fixtures/adhesivemountelectricalcomponentheatsink-inputs"
for (const source of [standardString, compactString]) {
  test(`adhesivemountelectricalcomponentheatsink React / vanilla routing: ${source}`, async () => {
    const definition = mp.string(source).json()
    if (definition.fn !== "adhesivemountelectricalcomponentheatsink")
      throw new Error("Expected adhesivemountelectricalcomponentheatsink")
    const { fn, ...props } = definition
    const geom = createAdhesiveMountElectricalComponentHeatsinkGeom(props),
      vanilla = await importVanilla()
    expect(typeof vanilla.AdhesiveMountElectricalComponentHeatsink).toBe(
      "function",
    )
    expect(
      typeof vanilla.createAdhesiveMountElectricalComponentHeatsinkMesh,
    ).toBe("function")
    expect(
      getComponentModel(ExtrudedPads, { footprint: source }).geometries,
    ).toHaveLength(0)
    for (const result of [
      getComponentModel(AdhesiveMountElectricalComponentHeatsink, props),
      getComponentModel(Footprinter3d, { footprint: source }),
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ]) {
      expect(result.geometries).toHaveLength(1)
      const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
      jscad.geometries.geom3.validate(solid)
      expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
        jscad.measurements.measureBoundingBox(geom),
      )
      expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
        jscad.measurements.measureVolume(geom),
        7,
      )
    }
  }, 30000)
}
test("adhesivemountelectricalcomponentheatsink invalid contract fails before rendering", async () => {
  const vanilla = await importVanilla()
  for (const source of [
    "adhesivemountelectricalcomponentheatsink_h1mm",
    "adhesivemountelectricalcomponentheatsink_fins2.5",
    "adhesivemountelectricalcomponentheatsink_fin10mm",
  ]) {
    expect(() =>
      getComponentModel(Footprinter3d, { footprint: source }),
    ).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ).toThrow()
  }
})
