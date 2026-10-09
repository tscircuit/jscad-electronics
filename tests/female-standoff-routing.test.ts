import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  FemaleStandoff,
  createFemaleStandoffGeom,
  createFemaleStandoffMesh,
} from "../lib/models/femalestandoff"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

const source = "femalestandoff_m3_af5.5mm_l10mm_hex_threadedthrough"
test("female standoff React, routing and built vanilla agree and exclude pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "femalestandoff")
    throw new Error("Expected female standoff")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createFemaleStandoffMesh(props)).toEqual(
    createFemaleStandoffMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const geometry = createFemaleStandoffGeom(props)
  for (const result of [
    getComponentModel(FemaleStandoff, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      6,
    )
  }
  expect(() =>
    getComponentModel(Footprinter3d, { footprint: `${source}_round` }),
  ).toThrow()
  expect(() => ExtrudedPads({ footprint: `${source}_af3mm` })).toThrow()
})
