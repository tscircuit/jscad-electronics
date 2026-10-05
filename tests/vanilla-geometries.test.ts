import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import type { RenderResult } from "../lib/vanilla/render"

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

test("vanilla flexscreen accepts pin count and pitch with a tapered connector end", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const { geometries }: RenderResult = getJscadModelForFootprint(
    "flexscreen30_w16_h10_flex5_p0.5mm_sitsflat_hidescreen_hidestiffeners_hideconductors",
    jscadModeling,
  )
  const shapes = geometries.map(({ geom }) => geom)
  const [minimum, maximum] =
    jscadModeling.measurements.measureAggregateBoundingBox(...shapes)
  expect(maximum[0] - minimum[0]).toBeCloseTo(15.94)
  const vertices = shapes.flatMap((g) =>
    jscadModeling.geometries.geom3.toPolygons(g).flatMap((p) => p.vertices),
  )
  const screenEnd = vertices.filter((v) => v[1] > 4.99)
  expect(Math.max(...screenEnd.map((v) => v[0]))).toBeCloseTo(2.5)
  expect(Math.min(...screenEnd.map((v) => v[0]))).toBeCloseTo(-2.5)
  for (const geometry of shapes) {
    expect(jscadModeling.measurements.measureVolume(geometry)).toBeGreaterThan(
      0,
    )
  }
})
