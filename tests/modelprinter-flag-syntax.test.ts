import { expect, test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

const cases = [
  [
    "shaftcollar_bore8mm_od16mm_w8mm_m4_setscrew_lefthanded",
    { setScrew: true, leftHanded: true },
    "shaftcollar_bore8mm_od16mm_w8mm_m4_mount(setscrew)",
  ],
  [
    "compressionspring_od8mm_wire1mm_l20mm_turns8_closedground_lefthanded",
    { closedGround: true, leftHanded: true },
    "compressionspring_od8mm_wire1mm_l20mm_turns8_hand(left)",
  ],
  [
    "hexbolt_m4_l10mm_hex_fullthread_lefthanded_nothreads",
    { hex: true, fullThread: true, leftHanded: true },
    "hexbolt_m4_l10mm_drive(hex)_nothreads",
  ],
  [
    "plainbushing_id8mm_od12mm_l20mm_plainclosed",
    { plainClosed: true },
    "plainbushing_id8mm_od12mm_l20mm_style(plainclosed)",
  ],
] as const

for (const [source, booleans, deprecated] of cases) {
  test(`${source}: boolean flags route to valid geometry and reject enum syntax`, async () => {
    const { getJscadModelForFootprint } = await importVanilla()
    expect(mp.string(source).json()).toMatchObject(booleans)
    expect(() => mp.string(deprecated).json()).toThrow()
    const geometries = getJscadModelForFootprint(source, jscad).geometries
    expect(geometries.length).toBeGreaterThan(0)
    for (const { geom } of geometries) {
      jscad.geometries.geom3.validate(geom)
      expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
    }
  })
}
