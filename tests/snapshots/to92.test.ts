import { expect, test } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import "../fixtures/png-matcher"
import { importVanilla } from "../fixtures/importVanilla.js"
import { renderFootprint } from "../helpers/render-footprint"

type ColoredGeometry = {
  geom: unknown
  color?: string | number[]
}

test("TO92", async () => {
  const pngBuffer = await renderFootprint("to92")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})

test("TO92 body uses the footprint origin", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const result = getJscadModelForFootprint("to92", jscadModeling)
  const body = (result.geometries as ColoredGeometry[]).find(
    ({ color }) => color === "#222",
  )

  expect(body).toBeDefined()

  const bbox = jscadModeling.measurements.measureBoundingBox(body!.geom)
  expect(bbox[0]![1]!).toBeCloseTo(0, 6)
  expect(bbox[1]![1]!).toBeCloseTo(4.5, 6)
})
