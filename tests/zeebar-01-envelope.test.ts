import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { createZeeBarGeom } from "../lib/models/zeebar"
import { props } from "./fixtures/zeebar"
test("zeebar 1: envelope bounds and end datum match the contract", () => {
  const geom = createZeeBarGeom(props)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  const bounds = [
    [-19, -15, 0],
    [19, 15, 80],
  ]
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(bounds[0]![axis]!, 8)
    expect(max[axis]).toBeCloseTo(bounds[1]![axis]!, 8)
  }
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
})
