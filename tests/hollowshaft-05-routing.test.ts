import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  HollowShaft,
  createHollowShaftGeom,
  createHollowShaftMesh,
} from "../lib/models/hollowshaft"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source = "hollowshaft_od20mm_id12mm_l200mm_style(roundtube)_endchamfer1mm"
test("hollowshaft React, full model string and vanilla share the geometry with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "hollowshaft") throw new Error("Wrong model")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createHollowShaftMesh(props)).toEqual(
    createHollowShaftMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = jscad.measurements.measureVolume(
    createHollowShaftGeom(props),
  )
  for (const result of [
    getComponentModel(HollowShaft, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    const solids = result.geometries.map(
      (g: { geom: unknown }) => g.geom as jscad.geometries.geom3.Geom3,
    )
    for (const solid of solids) jscad.geometries.geom3.validate(solid)
    expect(
      solids.reduce(
        (sum: number, solid: jscad.geometries.geom3.Geom3) =>
          sum + jscad.measurements.measureVolume(solid),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
})
