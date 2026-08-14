import { test, expect } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import React from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

const renderTo220 = () => {
  const geometries: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  createJSCADRoot(geometries).render(
    React.createElement(Footprinter3d, { footprint: "to220" }),
  )
  return geometries
}

test("TO220", async () => {
  const pngBuffer = await renderFootprint("to220")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})

test("TO220 leads expose full through-hole length below the PCB plane", () => {
  const geometries = renderTo220()
  const [min, max] = jscadModeling.measurements.measureAggregateBoundingBox(
    ...geometries,
  )

  expect(min[2]).toBeLessThan(-8)
  expect(max[2]).toBeLessThan(25)

  const body = geometries.find(
    ({ color }) =>
      Math.abs((color?.[0] ?? 0) - 0x22 / 0xff) < 0.01 ||
      Math.abs((color?.[0] ?? 0) - 0x55 / 0xff) < 0.01,
  )
  expect(body).toBeDefined()

  const [bodyMin] = jscadModeling.measurements.measureBoundingBox(body)
  expect(bodyMin[2]).toBeLessThan(7)
  expect(bodyMin[2]! - min[2]!).toBeGreaterThan(13)
  expect(bodyMin[2]! - min[2]!).toBeLessThan(15)
})
