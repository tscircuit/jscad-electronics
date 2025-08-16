import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"

test("vanilla build returns geometries for soic8", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("soic8")
  expect(res).toBeDefined()
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})
