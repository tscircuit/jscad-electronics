import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import Module from "manifold-3d"

test("compare jscad vs manifold output for 0805", async () => {
  const {
    getJscadModelForFootprint,
    getManifoldModelForFootprint,
    createManifoldJscadAdapter,
  } = await importVanilla()

  const jscadResult = getJscadModelForFootprint("0805", jscadModeling)

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)
  const manifoldResult = getManifoldModelForFootprint("0805", adapter)

  expect(jscadResult.geometries.length).toBeGreaterThan(0)
  expect(manifoldResult.geometries.length).toBeGreaterThan(0)
  expect(manifoldResult.geometries.length).toBe(jscadResult.geometries.length)

  for (let i = 0; i < manifoldResult.geometries.length; i++) {
    const mGeom = manifoldResult.geometries[i].geom
    const jGeom = jscadResult.geometries[i].geom

    const mIs3D = mGeom.polygons && mGeom.polygons.length > 0
    const jIs3D = jGeom.polygons && jGeom.polygons.length > 0
    const mIs2D = mGeom.sides && mGeom.sides.length > 0
    const jIs2D = jGeom.sides && jGeom.sides.length > 0

    expect(mIs3D || mIs2D).toBe(true)
    if (jIs3D) expect(mIs3D).toBe(true)
    if (jIs2D) expect(mIs2D).toBe(true)
  }
})
