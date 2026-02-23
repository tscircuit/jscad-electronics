import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import Module from "manifold-3d"

test("manifold adapter returns geometries for 0402", async () => {
  const { getManifoldModelForFootprint, createManifoldJscadAdapter } =
    await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  const res = getManifoldModelForFootprint("0402", adapter)
  expect(res).toBeDefined()
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})
