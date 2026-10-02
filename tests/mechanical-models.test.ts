import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { HexSocketBolt, createHexSocketBoltGeom } from "../lib/HexSocketBolt"
import { SheetMetal, createSheetMetalGeom } from "../lib/SheetMetal"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { mp } from "@tscircuit/modelprinter"

for (const source of [
  "hexsocketbolt_m3_l6mm",
  "hexsocketbolt_m2.5_l8mm_nothreads",
  "sheetmetal_plate_w20_l16_hole1(d4_bottomface)",
  "sheetmetal_angle_w28_l24_h16_t1_r2",
  "sheetmetal_channel_w28_l24_h16_t1_r2",
]) {
  test(`${source}: migrated geometry works in both renderers`, async () => {
    const definition = mp.string(source).json()
    const { fn, ...props } = definition
    const geometry =
      fn === "hexsocketbolt"
        ? createHexSocketBoltGeom(
            props as Parameters<typeof createHexSocketBoltGeom>[0],
          )
        : createSheetMetalGeom(
            props as Parameters<typeof createSheetMetalGeom>[0],
          )
    jscad.geometries.geom3.validate(geometry)
    expect(jscad.measurements.measureVolume(geometry)).toBeGreaterThan(0)
    const expected = jscad.measurements.measureBoundingBox(geometry)
    const direct =
      fn === "hexsocketbolt"
        ? getComponentModel(
            HexSocketBolt,
            props as Parameters<typeof HexSocketBolt>[0],
          )
        : getComponentModel(
            SheetMetal,
            props as Parameters<typeof SheetMetal>[0],
          )
    const routed = getComponentModel(Footprinter3d, { footprint: source })
    const vanilla = await importVanilla()
    const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    for (const result of [direct, routed, built]) {
      expect(result.geometries).toHaveLength(1)
      const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
      expect(jscad.measurements.measureBoundingBox(solid)).toEqual(expected)
      expect(jscad.measurements.measureVolume(solid)).toBeGreaterThan(0)
    }
  })
}
