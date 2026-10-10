import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  KeyedShaft,
  createKeyedShaftGeom,
  createKeyedShaftMesh,
} from "../lib/models/keyedshaft"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const source =
  "keyedshaft_d20mm_l250mm_keyw6mm_keydepth3mm_keyl200mm_endchamfer1mm"
test("keyedshaft React, full model string and vanilla share the geometry with no copper pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "keyedshaft") throw new Error("Wrong model")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createKeyedShaftMesh(props)).toEqual(
    createKeyedShaftMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const reference = jscad.measurements.measureVolume(
    createKeyedShaftGeom(props),
  )
  for (const result of [
    getComponentModel(KeyedShaft, props),
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
