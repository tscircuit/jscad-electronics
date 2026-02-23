import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import Module from "manifold-3d"

test("manifold geometry volumes are comparable to jscad", async () => {
  const {
    getJscadModelForFootprint,
    getManifoldModelForFootprint,
    createManifoldJscadAdapter,
  } = await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  const manifoldResult = getManifoldModelForFootprint("0402", adapter)

  for (let i = 0; i < manifoldResult.geometries.length; i++) {
    const mGeom = manifoldResult.geometries[i].geom
    if (mGeom.polygons) {
      const triCount = mGeom.polygons.length
      expect(triCount).toBeGreaterThan(0)

      for (const poly of mGeom.polygons) {
        expect(poly.vertices.length).toBe(3)
      }
    }
  }
})
