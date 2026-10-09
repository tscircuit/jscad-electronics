import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { DowelPin, createDowelPinGeom } from "../lib/models/dowelpin"
const source = "dowelpin_standard(iso8734)_d3mm_l10mm"
test("dowel pin React and built vanilla routes share nominal solid geometry and emit no pads", async () => {
  const model = mp.string(source).json()
  if (model.fn !== "dowelpin") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const geom = createDowelPinGeom(props)
  const vanilla = await importVanilla()
  for (const name of ["DowelPin", "createDowelPinMesh", "createDowelPinGeom"])
    expect(typeof vanilla[name]).toBe("function")
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(DowelPin, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
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
test("dowel pin public renderers reject unsupported and contradictory strings", async () => {
  const vanilla = await importVanilla()
  for (const value of [
    source + "_threads",
    source + "_c0.4mm",
    source + "_d3mm",
    source.replace("l10mm", "l11mm"),
  ]) {
    expect(() => Footprinter3d({ footprint: value })).toThrow()
    expect(() => ExtrudedPads({ footprint: value })).toThrow()
    expect(() => vanilla.getJscadModelForFootprint(value, jscad)).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(value, jscad),
    ).toThrow()
  }
})
