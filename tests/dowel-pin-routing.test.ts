import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { DowelPin, createDowelPinGeom } from "../lib/models/dowelpin"
const source = "dowelpin_d3mm_l10mm"
for (const value of [source, "dowelpin_iso8734_d3mm_l10mm"])
  test(`dowel pin ${value} React and built vanilla routes share the default ISO geometry without pads`, async () => {
    const model = mp.string(value).json()
    if (model.fn !== "dowelpin") throw new Error("Unexpected model")
    const defaultModel = mp.string(source).json()
    if (defaultModel.fn !== "dowelpin") throw new Error("Unexpected model")
    expect(model.iso8734).toBe(true)
    expect(model).not.toHaveProperty("standard")
    expect(model).toEqual(defaultModel)
    const { fn, ...props } = model
    const geom = createDowelPinGeom(props)
    const vanilla = await importVanilla()
    for (const name of ["DowelPin", "createDowelPinMesh", "createDowelPinGeom"])
      expect(typeof vanilla[name]).toBe("function")
    expect(ExtrudedPads({ footprint: value })).toBeNull()
    for (const result of [
      getComponentModel(DowelPin, props),
      getComponentModel(Footprinter3d, { footprint: value }),
      vanilla.getJscadModelForFootprintWithPads(value, jscad),
    ]) {
      expect(result.geometries).toHaveLength(1)
      const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
      expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
        jscad.measurements.measureBoundingBox(geom),
      )
      expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
        jscad.measurements.measureVolume(geom),
        6,
      )
    }
  })
test("dowel pin public renderers reject legacy selectors, valued flags and invalid contracts", async () => {
  const vanilla = await importVanilla()
  for (const value of [
    source + "_threads",
    source + "_c0.4mm",
    source + "_d3mm",
    source.replace("l10mm", "l11mm"),
    source + "_standard(iso8734)",
    source + "_standard(iso8734:1997)",
    source + "_iso8734(true)",
    source + "_iso8734(false)",
    source + "_iso8734:1997",
    source + "_iso8735",
    source + "_iso8734_iso8734",
    source + "_iso8734_ISO8734",
  ]) {
    expect(() => Footprinter3d({ footprint: value })).toThrow()
    expect(() => ExtrudedPads({ footprint: value })).toThrow()
    expect(() => vanilla.getJscadModelForFootprint(value, jscad)).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(value, jscad),
    ).toThrow()
  }
})
