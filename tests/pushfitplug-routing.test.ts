import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  PushFitPlug,
  createPushFitPlugGeom,
  createPushFitPlugMesh,
} from "../lib/models/pushfitplug"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source = "pushfitplug_tubeod6mm_l18mm_headod10mm_headt3mm"
test("pushfitplug React, string and built vanilla routing with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "pushfitplug") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createPushFitPlugMesh(p)).toEqual(createPushFitPlugMesh(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = createPushFitPlugGeom(p)
  for (const result of [
    getComponentModel(PushFitPlug, p),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    const solids: jscad.geometries.geom3.Geom3[] = result.geometries.map(
      (g: { geom: unknown }) => g.geom as jscad.geometries.geom3.Geom3,
    )
    for (const solid of solids) jscad.geometries.geom3.validate(solid)
    const volume = solids.reduce(
      (sum, solid) => sum + jscad.measurements.measureVolume(solid),
      0,
    )
    expect(volume).toBeCloseTo(jscad.measurements.measureVolume(reference), 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})
