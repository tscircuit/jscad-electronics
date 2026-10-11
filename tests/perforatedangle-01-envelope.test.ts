import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { createPerforatedAngleGeom } from "../lib/models/perforatedangle"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 1: envelope bounds and end datum match the contract", () => {
  const geom = createPerforatedAngleGeom(props)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  const bounds = [
    [-12.5, -12.5, 0],
    [12.5, 12.5, 80],
  ]
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(bounds[0]![axis]!, 8)
    expect(max[axis]).toBeCloseTo(bounds[1]![axis]!, 8)
  }
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
})
