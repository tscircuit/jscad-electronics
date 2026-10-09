import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  NylonLockNut,
  createNylonLockNutGeometries,
} from "../lib/models/nylonlocknut"

for (const source of [
  "nylonlocknut_standard(iso7040)_m6",
  "nylonlocknut_m5_nothreads",
])
  test(`${source} React and built vanilla routing preserve separate nylon color and no pads`, async () => {
    const definition = mp.string(source).json()
    if (definition.fn !== "nylonlocknut") throw new Error("Unexpected model")
    const { fn, ...props } = definition
    const parts = createNylonLockNutGeometries(props)
    const vanilla = await importVanilla()
    expect(typeof vanilla.createNylonLockNutMesh).toBe("function")
    expect(typeof vanilla.createNylonLockNutMeshes).toBe("function")
    expect(typeof vanilla.createNylonLockNutGeom).toBe("function")
    expect(ExtrudedPads({ footprint: source })).toBeNull()
    for (const result of [
      getComponentModel(NylonLockNut, props),
      getComponentModel(Footprinter3d, { footprint: source }),
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ]) {
      expect(result.geometries).toHaveLength(2)
      const colored = result.geometries as {
        geom: jscad.geometries.geom3.Geom3
        color?: string | number[]
      }[]
      for (const [index, item] of colored.entries()) {
        const actual = item.color ?? item.geom.color
        const expected = index === 0 ? "#737e8f" : "#236cd2"
        if (typeof actual === "string") expect(actual).toBe(expected)
        else
          expect(actual).toEqual([
            parseInt(expected.slice(1, 3), 16) / 255,
            parseInt(expected.slice(3, 5), 16) / 255,
            parseInt(expected.slice(5, 7), 16) / 255,
            1,
          ])
      }
      for (const [index, expected] of [parts.metal, parts.insert].entries()) {
        const actual = result.geometries[index]!
          .geom as jscad.geometries.geom3.Geom3
        expect(jscad.measurements.measureBoundingBox(actual)).toEqual(
          jscad.measurements.measureBoundingBox(expected),
        )
        expect(jscad.measurements.measureVolume(actual)).toBeCloseTo(
          jscad.measurements.measureVolume(expected),
          6,
        )
      }
    }
  })
