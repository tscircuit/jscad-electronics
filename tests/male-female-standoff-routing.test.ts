import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  MaleFemaleStandoff,
  createMaleFemaleStandoffGeom,
} from "../lib/models/malefemalestandoff"
const source = "malefemalestandoff_m3_af5.5mm_l10mm_studl5mm_femaledepth6mm_hex"

test("male-female standoff direct React, registered React and built vanilla share geometry without pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "malefemalestandoff")
    throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createMaleFemaleStandoffGeom(props)
  const vanilla = await importVanilla()
  expect(typeof vanilla.MaleFemaleStandoff).toBe("function")
  expect(typeof vanilla.createMaleFemaleStandoffMesh).toBe("function")
  expect(typeof vanilla.createMaleFemaleStandoffGeom).toBe("function")
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(MaleFemaleStandoff, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      6,
    )
  }
})
test("male-female standoff public routes reject invalid strings before creating geometry or pads", async () => {
  const vanilla = await importVanilla()
  for (const value of [
    source + "_round",
    source + "_hex",
    source.replace("femaledepth6mm", "femaledepth10mm"),
    source + "_lefthanded_righthanded",
  ]) {
    expect(() => Footprinter3d({ footprint: value })).toThrow()
    expect(() => ExtrudedPads({ footprint: value })).toThrow()
    expect(() => vanilla.getJscadModelForFootprint(value, jscad)).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(value, jscad),
    ).toThrow()
  }
})
