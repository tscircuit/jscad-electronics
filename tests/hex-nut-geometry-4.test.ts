import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  HexNut,
  createHexNutMesh,
  createHexNutGeom,
} from "../lib/models/hexnut"

test("hexnut React and built vanilla routing share geometry and exclude PCB pads", async () => {
  const source = "hexnut_standard(iso4032)_m6"
  const definition = mp.string(source).json()
  if (definition.fn !== "hexnut") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createHexNutGeom(props)
  const direct = getComponentModel(HexNut, props)
  const routed = getComponentModel(Footprinter3d, { footprint: source })
  const vanilla = await importVanilla()
  const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(typeof vanilla.createHexNutMesh).toBe("function")
  expect(typeof vanilla.createHexNutGeom).toBe("function")
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
