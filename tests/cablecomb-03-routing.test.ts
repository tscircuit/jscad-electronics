import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import {
  CableComb,
  createCableCombGeom,
  createCableCombMesh,
} from "../lib/models/cablecomb"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { props, modelString } from "./fixtures/cablecomb-case"
test("cablecomb supports React, registered strings and built vanilla without copper pads", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createCableCombMesh(props)).toEqual(createCableCombMesh(props))
  expect(ExtrudedPads({ footprint: modelString })).toBeNull()
  const expected = jscad.measurements.measureVolume(createCableCombGeom(props))
  for (const result of [
    getComponentModel(CableComb, props),
    getComponentModel(Footprinter3d, { footprint: modelString }),
    vanilla.getJscadModelForFootprintWithPads(modelString, jscad),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    const volume = result.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 5)
  }
  expect(() => Footprinter3d({ footprint: modelString + "_typo1mm" })).toThrow()
})
