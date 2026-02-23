import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import Module from "manifold-3d"

test("manifold adapter returns geometries for soic8", async () => {
  const { getManifoldModelForFootprint, createManifoldJscadAdapter } =
    await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  const res = getManifoldModelForFootprint("soic8", adapter)
  expect(res).toBeDefined()
  expect(Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})

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

test("manifold adapter geometries have polygon data", async () => {
  const { getManifoldModelForFootprint, createManifoldJscadAdapter } =
    await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  const res = getManifoldModelForFootprint("0402", adapter)
  // At least some geometries should have 3D polygon data
  const geom3s = res.geometries.filter(
    (g: any) => g.geom.polygons && g.geom.polygons.length > 0,
  )
  expect(geom3s.length).toBeGreaterThan(0)
})
