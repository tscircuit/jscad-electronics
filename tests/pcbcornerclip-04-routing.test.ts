import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  PcbCornerClip,
  createPcbCornerClipGeom,
  createPcbCornerClipMesh,
} from "../lib/models/pcbcornerclip"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source, p } from "./fixtures/pcbcornerclip-example"

test("pcbcornerclip React, model-string and built vanilla rendering", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createPcbCornerClipMesh(p)).toEqual(createPcbCornerClipMesh(p))
  const reference = createPcbCornerClipGeom(p)
  for (const result of [
    getComponentModel(PcbCornerClip, p),
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
