import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  ButtonScrew,
  createButtonScrewMesh,
  createButtonScrewGeom,
} from "../lib/models/buttonscrew"

test("buttonscrew React and built vanilla routing share geometry and exclude PCB pads", async () => {
  const source = "buttonscrew_standard(iso7380-1)_m3_l10mm_drive(hexsocket)"
  const definition = mp.string(source).json()
  if (definition.fn !== "buttonscrew") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createButtonScrewGeom(props)
  const direct = getComponentModel(ButtonScrew, props)
  const routed = getComponentModel(Footprinter3d, { footprint: source })
  const vanilla = await importVanilla()
  const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(typeof vanilla.createButtonScrewMesh).toBe("function")
  expect(typeof vanilla.createButtonScrewGeom).toBe("function")
  for (const result of [direct, routed, built]) {
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
