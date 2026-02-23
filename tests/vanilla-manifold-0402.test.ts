import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"

test("manifold adapter returns geometries for 0402", async () => {
  const { getManifoldModelForFootprint, createManifoldJscadAdapter } =
    await importVanilla()

  const adapter = await createManifoldJscadAdapter()

  const res = getManifoldModelForFootprint("0402", adapter)
  expect(res).toBeDefined()
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})
