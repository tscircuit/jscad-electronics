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

for (const source of [
  "hexnut_m6",
  "hexnut_m6_iso4032",
  "hexnut_m3",
  "hexnut_m3_din934",
  "hexnut_imperial(1/4-20)",
  "hexnut_imperial(1/4-20)_asmeb18.2.2",
  "hexnut_imperial(#6-32)",
])
  test(`${source} React and built vanilla routing share geometry and exclude PCB pads`, async () => {
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

for (const [source, flag] of [
  ["hexnut_m6", "iso4032"],
  ["hexnut_m3", "din934"],
  ["hexnut_imperial(1/4-20)", "asmeb18.2.2"],
  ["hexnut_imperial(#6-32)", "asmeb1822"],
] as const)
  test(`${source} omitted and explicit family flags produce identical meshes`, () => {
    const implicit = mp.string(source).json()
    const explicit = mp.string(`${source}_${flag}`).json()
    if (implicit.fn !== "hexnut" || explicit.fn !== "hexnut")
      throw new Error("Unexpected model")
    const { fn: implicitFn, ...implicitProps } = implicit
    const { fn: explicitFn, ...explicitProps } = explicit
    const resolution = { radialSegments: 48, segmentsPerPitch: 16 }
    expect(createHexNutMesh(explicitProps, resolution)).toEqual(
      createHexNutMesh(implicitProps, resolution),
    )
  })
