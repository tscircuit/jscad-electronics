import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  SandwichMount,
  createSandwichMountGeom,
  createSandwichMountMesh,
} from "../lib/models/sandwichmount"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source =
  "sandwichmount_w50mm_l50mm_h25mm_holepitch35mm_holed6mm_coreh19mm_platethickness3mm"
test("sandwichmount React, string and built vanilla routing with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "sandwichmount") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createSandwichMountMesh(p)).toEqual(createSandwichMountMesh(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = createSandwichMountGeom(p)
  for (const result of [
    getComponentModel(SandwichMount, p),
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
