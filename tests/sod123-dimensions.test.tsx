import { expect, test } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"

const renderSod123 = () => {
  const geometries: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  createJSCADRoot(geometries).render(<Footprinter3d footprint="sod123" />)
  return geometries
}

const sizeOf = (geometries: any[]) => {
  const [min, max] = jscadModeling.measurements.measureAggregateBoundingBox(
    ...geometries,
  )
  return max.map((value, index) => value - min[index]!)
}

test("SOD123 geometry follows the Vishay package drawing", () => {
  const geometries = renderSod123()
  const [length, width, height] = sizeOf(geometries)

  expect(length).toBeCloseTo(3.7)
  expect(width).toBeCloseTo(1.55)
  expect(height).toBeGreaterThanOrEqual(1)
  expect(height).toBeLessThanOrEqual(1.35)

  const body = geometries.find(({ color }) => color?.[0] === 0x22 / 0xff)
  expect(body).toBeDefined()
  const [bodyMin, bodyMax] = jscadModeling.measurements.measureBoundingBox(body)
  expect(bodyMax[0]! - bodyMin[0]!).toBeCloseTo(2.7)
  expect(bodyMax[1]! - bodyMin[1]!).toBeCloseTo(1.55)
  expect(bodyMin[2]).toBeCloseTo(0.1)

  const leads = geometries.filter(({ color }) => color?.[0] === 1)
  expect(leads).toHaveLength(2)
  for (const lead of leads) {
    const [leadMin, leadMax] =
      jscadModeling.measurements.measureBoundingBox(lead)
    expect(leadMax[1]! - leadMin[1]!).toBeCloseTo(0.55)
  }
})
