import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"

// led0603 throws "Could not determine required pad dimensions (p, pw, ph)"
// because the bundled @tscircuit/footprinter (0.0.354) can't parse imperial
// size codes for led footprints (fixed upstream in footprinter 0.0.356).
test.failing("led0603 returns geometries like 0603 does", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("led0603", jscadModeling)
  expect(res).toBeDefined()
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})
