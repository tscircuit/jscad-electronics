import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  CableTieBase,
  createCableTieBaseGeom,
  createCableTieBaseMesh,
} from "../lib/models/cabletiebase"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source, p } from "./fixtures/cabletiebase-example"

test("cabletiebase React, model-string and built vanilla rendering", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createCableTieBaseMesh(p)).toEqual(createCableTieBaseMesh(p))
  const reference = createCableTieBaseGeom(p)
  for (const result of [
    getComponentModel(CableTieBase, p),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    const solids = result.geometries.map(
      (g: { geom: unknown }) => g.geom as jscad.geometries.geom3.Geom3,
    )
    expect(solids.length).toBeGreaterThan(0)
    for (const solid of solids) jscad.geometries.geom3.validate(solid)
    expect(
      solids.reduce(
        (sum: number, solid: jscad.geometries.geom3.Geom3) =>
          sum + jscad.measurements.measureVolume(solid),
        0,
      ),
    ).toBeCloseTo(jscad.measurements.measureVolume(reference), 5)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    const expected = jscad.measurements.measureBoundingBox(reference)
    for (let i = 0; i < 2; i++)
      for (let axis = 0; axis < 3; axis++)
        expect(bounds[i]![axis]).toBeCloseTo(expected[i]![axis]!, 7)
  }
})
