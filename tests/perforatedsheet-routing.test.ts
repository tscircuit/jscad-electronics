import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  PerforatedSheet,
  createPerforatedSheetGeom,
  createPerforatedSheetMesh,
} from "../lib/models/perforatedsheet"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source =
  "perforatedsheet_l60mm_w40mm_t1mm_hole3mm_pitchx10mm_pitchy10mm_edgex5mm_edgey5mm_stagger0mm"
test("perforatedsheet React, string and built vanilla routing with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "perforatedsheet") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createPerforatedSheetMesh(p)).toEqual(
    createPerforatedSheetMesh(p),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = createPerforatedSheetGeom(p)
  for (const result of [
    getComponentModel(PerforatedSheet, p),
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
