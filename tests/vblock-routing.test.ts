import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  VBlock,
  createVBlockGeom,
  createVBlockMesh,
} from "../lib/models/vblock"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source =
  "vblock_l60mm_w40mm_h40mm_vangle90deg_vdepth10mm_mountgroovew3mm_mountgrooved3mm_mountz10mm"
test("vblock React, string and built vanilla routing with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "vblock") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createVBlockMesh(p)).toEqual(createVBlockMesh(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = createVBlockGeom(p)
  for (const result of [
    getComponentModel(VBlock, p),
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
