import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"

test("vanilla build returns geometries for soic8", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("soic8", jscadModeling)
  expect(res).toBeDefined()
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})

test("vanilla build renders a flexscreen model string", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint(
    "flexscreen_w40mm_h22.5mm_flex60mm_foldsabove_distance20mm_foldstart9mm_outset6mm",
    jscadModeling,
  )
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(5)
})
