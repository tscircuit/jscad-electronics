import { expect, test } from "bun:test"
import { fp } from "@tscircuit/footprinter"
import { Footprinter3d } from "../lib/Footprinter3d"

/**
 * Footprinter coverage test.
 *
 * Every footprint name exposed by @tscircuit/footprinter must produce a
 * non-null 3D model from <Footprinter3d />. If footprinter adds a new
 * footprint function, it automatically appears here and fails until a
 * model is wired up in lib/Footprinter3d.tsx — this is the checklist for
 * the "missing models" backlog.
 */

// Footprint names that need parameters to parse into valid footprint
// strings. Everything else is used as-is.
const FOOTPRINT_STRING_OVERRIDES: Record<string, string> = {
  cap: "cap0603",
  diode: "diode0603",
  led: "led0603",
  res: "res0603",
  fpc: "fpc4",
  jst: "jst4_sh",
}

// Footprint names where fp.string(...) itself throws inside
// @tscircuit/footprinter (broken upstream). Tracked separately so the
// test starts failing if footprinter fixes them and they become
// renderable — at that point wire them into Footprinter3d and move them
// out of this list.
const BROKEN_IN_FOOTPRINTER = new Set(["pad", "vson"])

const footprintNames = fp.getFootprintNames()

test("every footprinter footprint renders a non-null 3D model", () => {
  const missing: string[] = []

  for (const name of footprintNames) {
    if (BROKEN_IN_FOOTPRINTER.has(name)) continue
    const footprint = FOOTPRINT_STRING_OVERRIDES[name] ?? name

    let element: unknown
    try {
      element = Footprinter3d({ footprint })
    } catch (error) {
      missing.push(`${name} (${footprint}) threw: ${(error as Error).message}`)
      continue
    }
    if (element === null || element === undefined) {
      missing.push(`${name} (${footprint}) returned null`)
    }
  }

  expect(missing).toEqual([])
})

test("JST connector series all render", () => {
  for (const footprint of ["jst2_zh", "jst4_sh", "jst6_ph", "jst4"]) {
    expect(Footprinter3d({ footprint })).not.toBeNull()
  }
  // legacy jstzh1_5mm string normalization still works
  expect(Footprinter3d({ footprint: "jstzh1_5mm4" })).not.toBeNull()
})

test("footprints broken upstream in footprinter are still broken", () => {
  for (const name of BROKEN_IN_FOOTPRINTER) {
    expect(() => fp.string(name).json()).toThrow()
  }
})
