import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { h } from "../lib/vanilla/h"
import {
  ExtrudeLinear,
  Polygon,
  renderToJscadModel,
} from "../lib/vanilla/primitives"

test("both polygon windings extrude outward", () => {
  const points: [number, number][] = [
    [-3, -2],
    [3, -2],
    [3, 2],
    [-3, 2],
  ]
  const original = JSON.stringify(points)
  for (const profile of [points, [...points].reverse()]) {
    for (const height of [5, -5]) {
      const model = renderToJscadModel(
        h(ExtrudeLinear, { height }, h(Polygon, { points: profile })),
        jscad,
      )
      const solid = model.geometries[0]!
      if (!jscad.geometries.geom3.isA(solid)) throw new Error("Expected solid")
      expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(120, 8)
      expect(() => jscad.geometries.geom3.validate(solid)).not.toThrow()
      expect(jscad.measurements.measureDimensions(solid)).toEqual([6, 4, 5])
    }
  }
  expect(JSON.stringify(points)).toBe(original)
})
