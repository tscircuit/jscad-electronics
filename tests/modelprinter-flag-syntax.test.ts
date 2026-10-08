import { expect, test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import * as jscad from "@jscad/modeling"
import { createHash } from "node:crypto"
import { importVanilla } from "./fixtures/importVanilla.js"

const pairs = [
  [
    "shaftcollar_bore8mm_od16mm_w8mm_m4_setscrew_lefthanded",
    "shaftcollar_bore8mm_od16mm_w8mm_m4_mount(setscrew)_threadhand(left)",
  ],
  [
    "compressionspring_od8mm_wire1mm_l20mm_turns8_closedground_lefthanded",
    "compressionspring_od8mm_wire1mm_l20mm_turns8_ends(closedground)_hand(left)",
  ],
  [
    "hexbolt_m4_l10mm_hex_fullthread_lefthanded_nothreads",
    "hexbolt_m4_l10mm_drive(hex)_thread(full)_threadhand(left)_nothreads",
  ],
  [
    "plainbushing_id8mm_od12mm_l20mm",
    "plainbushing_id8mm_od12mm_l20mm_style(plainclosed)",
  ],
] as const

for (const [flags, selectors] of pairs) {
  test(`${flags}: flag syntax renders the expected model`, async () => {
    const { getJscadModelForFootprint } = await importVanilla()
    expect(mp.string(flags).json()).toEqual(mp.string(selectors).json())
    const actual = getJscadModelForFootprint(flags, jscad).geometries
    const expected = getJscadModelForFootprint(selectors, jscad).geometries
    const digest = (value: unknown) =>
      createHash("sha256").update(JSON.stringify(value)).digest("hex")
    expect(actual.length).toBeGreaterThan(0)
    expect(digest(actual)).toBe(digest(expected))
    for (const { geom } of actual) {
      expect(jscad.geometries.geom3.toPolygons(geom).length).toBeGreaterThan(0)
      expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
    }
  })
}
