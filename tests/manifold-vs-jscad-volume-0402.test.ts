import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"

test("manifold and jscad produce matching volume/area/genus for 0402", async () => {
  const {
    getJscadModelForFootprint,
    getManifoldModelForFootprint,
    createManifoldJscadAdapter,
  } = await importVanilla()

  const jscadResult = getJscadModelForFootprint("0402", jscadModeling)

  const adapter = await createManifoldJscadAdapter()
  const manifoldResult = getManifoldModelForFootprint("0402", adapter)

  for (let i = 0; i < jscadResult.geometries.length; i++) {
    const jGeom = jscadResult.geometries[i].geom
    const mGeom = manifoldResult.geometries[i].geom

    if (!jGeom.polygons || !mGeom._manifold) continue

    const jVol = Math.abs(jscadModeling.measurements.measureVolume(jGeom))
    const jArea = Math.abs(jscadModeling.measurements.measureArea(jGeom))
    const mVol = mGeom.volume()
    const mArea = mGeom.surfaceArea()
    const mGenus = mGeom.genus()

    // Volume should match within 1%
    expect(Math.abs(jVol - mVol) / Math.max(jVol, 1e-6)).toBeLessThan(0.01)
    // Surface area should match within 5%
    expect(Math.abs(jArea - mArea) / Math.max(jArea, 1e-6)).toBeLessThan(0.05)
    // Genus should be 0 (solid body, no holes)
    expect(mGenus).toBe(0)
  }
})
