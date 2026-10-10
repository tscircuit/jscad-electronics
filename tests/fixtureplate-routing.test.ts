import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  FixturePlate,
  createFixturePlateGeom,
  createFixturePlateMesh,
} from "../lib/models/fixtureplate"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source =
  "fixtureplate_l80mm_w60mm_t8mm_hole6mm_cols3_rows2_pitch25mm_edgex15mm_edgey15mm"
test("fixtureplate React, string and built vanilla routing with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "fixtureplate") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createFixturePlateMesh(p)).toEqual(createFixturePlateMesh(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = createFixturePlateGeom(p)
  for (const result of [
    getComponentModel(FixturePlate, p),
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
