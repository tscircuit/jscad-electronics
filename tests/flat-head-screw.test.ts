import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  FlatHeadScrew,
  createFlatHeadScrewGeom,
  createFlatHeadScrewMesh,
} from "../lib/FlatHeadScrew"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { assertFlatHeadScrewGeometry } from "./fixtures/assert-flat-head-screw-geometry"

test(
  "flatheadscrew closed oriented geometry, datum, thread handedness and resolution",
  assertFlatHeadScrewGeometry,
)
test("flatheadscrew React, vanilla and footprint dispatch", async () => {
  const source = "flatheadscrew_standard(iso10642)_m3_l10mm_drive(hexsocket)"
  const definition = mp.string(source).json()
  if (definition.fn !== "flatheadscrew") throw new Error("Wrong family")
  const { fn, ...props } = definition
  const geom = createFlatHeadScrewGeom(props)
  jscad.geometries.geom3.validate(geom)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const vanilla = await importVanilla()
  for (const result of [
    getComponentModel(FlatHeadScrew, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(bounds)
    expect(jscad.measurements.measureVolume(solid)).toBeGreaterThan(0)
  }
})
