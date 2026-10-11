import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { createHatSectionGeom } from "../lib/models/hatsection"
import { props } from "./fixtures/hatsection"
test("hatsection 1: envelope bounds and end datum match the contract", () => {
  const geom = createHatSectionGeom(props)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  const bounds = [
    [-30, -10, 0],
    [30, 10, 80],
  ]
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(bounds[0]![axis]!, 8)
    expect(max[axis]).toBeCloseTo(bounds[1]![axis]!, 8)
  }
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
})
