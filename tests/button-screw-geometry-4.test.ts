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
  const source = "buttonscrew_m3_l10mm"
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

test("buttonscrew default ISO and explicit ISO 7380-1 flag render identically", async () => {
  const omitted = "buttonscrew_m3_l10mm"
  const explicit = "BUTTONSCREW_ISO7380-1_M3_L10MM"
  const defaultModel = mp.string(omitted).json()
  const explicitModel = mp.string(explicit).json()
  expect(explicitModel).toEqual(defaultModel)
  if (defaultModel.fn !== "buttonscrew" || explicitModel.fn !== "buttonscrew")
    throw new Error("Unexpected model")
  const { fn: defaultFn, ...defaultProps } = defaultModel
  const { fn: explicitFn, ...explicitProps } = explicitModel
  expect(createButtonScrewMesh(explicitProps)).toEqual(
    createButtonScrewMesh(defaultProps),
  )
  expect(ExtrudedPads({ footprint: explicit })).toBeNull()
  const vanilla = await importVanilla()
  expect(
    vanilla.getJscadModelForFootprintWithPads(explicit, jscad).geometries,
  ).toEqual(
    vanilla.getJscadModelForFootprintWithPads(omitted, jscad).geometries,
  )
  expect(
    getComponentModel(Footprinter3d, { footprint: explicit }).geometries,
  ).toEqual(getComponentModel(Footprinter3d, { footprint: omitted }).geometries)
})
