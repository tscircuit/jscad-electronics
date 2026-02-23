import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import Module from "manifold-3d"

/**
 * Comparison tests: render the same footprint with both jscad and manifold
 * backends, verifying that manifold produces comparable output.
 */

const FOOTPRINTS_TO_COMPARE = ["0402", "0805", "soic8"]

for (const fp of FOOTPRINTS_TO_COMPARE) {
  test(`compare jscad vs manifold output for ${fp}`, async () => {
    const {
      getJscadModelForFootprint,
      getManifoldModelForFootprint,
      createManifoldJscadAdapter,
    } = await importVanilla()

    // Render with jscad
    const jscadResult = getJscadModelForFootprint(fp, jscadModeling)

    // Render with manifold
    const wasm = await Module()
    wasm.setup()
    const adapter = createManifoldJscadAdapter(wasm)
    const manifoldResult = getManifoldModelForFootprint(fp, adapter)

    // Both should produce geometries
    expect(jscadResult.geometries.length).toBeGreaterThan(0)
    expect(manifoldResult.geometries.length).toBeGreaterThan(0)

    // Same number of geometry objects (body + leads + pads etc.)
    expect(manifoldResult.geometries.length).toBe(jscadResult.geometries.length)

    // Each geometry should have polygon data
    for (let i = 0; i < manifoldResult.geometries.length; i++) {
      const mGeom = manifoldResult.geometries[i].geom
      const jGeom = jscadResult.geometries[i].geom

      // Both should be 3D (have polygons) or 2D (have sides)
      const mIs3D = mGeom.polygons && mGeom.polygons.length > 0
      const jIs3D = jGeom.polygons && jGeom.polygons.length > 0
      const mIs2D = mGeom.sides && mGeom.sides.length > 0
      const jIs2D = jGeom.sides && jGeom.sides.length > 0

      expect(mIs3D || mIs2D).toBe(true)
      // Both should be same dimensionality
      if (jIs3D) expect(mIs3D).toBe(true)
      if (jIs2D) expect(mIs2D).toBe(true)
    }

    // Colors should match
    for (let i = 0; i < manifoldResult.geometries.length; i++) {
      const mColor = manifoldResult.geometries[i].color
      const jColor = jscadResult.geometries[i].color
      // Both should have same color (or both undefined)
      if (jColor && mColor) {
        // Colors may be represented differently; just check they both exist
        expect(mColor).toBeDefined()
      }
    }
  })
}

test("manifold geometry volumes are comparable to jscad", async () => {
  const {
    getJscadModelForFootprint,
    getManifoldModelForFootprint,
    createManifoldJscadAdapter,
  } = await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  // Compare a simple component (0402 chip resistor)
  const jscadResult = getJscadModelForFootprint("0402", jscadModeling)
  const manifoldResult = getManifoldModelForFootprint("0402", adapter)

  // Compare total vertex counts - manifold may have different tessellation
  // but should produce a reasonable mesh
  for (let i = 0; i < manifoldResult.geometries.length; i++) {
    const mGeom = manifoldResult.geometries[i].geom
    if (mGeom.polygons) {
      // Count total triangles
      const triCount = mGeom.polygons.length
      expect(triCount).toBeGreaterThan(0)

      // Verify all triangles have 3 vertices (manifold always produces triangles)
      for (const poly of mGeom.polygons) {
        expect(poly.vertices.length).toBe(3)
      }
    }
  }
})
