import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import Module from "manifold-3d"

test("manifold adapter geometries have polygon data", async () => {
  const { getManifoldModelForFootprint, createManifoldJscadAdapter } =
    await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  const res = getManifoldModelForFootprint("0402", adapter)
  const geom3s = res.geometries.filter(
    (g: any) => g.geom.polygons && g.geom.polygons.length > 0,
  )
  expect(geom3s.length).toBeGreaterThan(0)
})
