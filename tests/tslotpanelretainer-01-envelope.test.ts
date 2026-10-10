import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { createTSlotPanelRetainerGeom } from "../lib/models/tslotpanelretainer"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 1: envelope bounds and end datum match the contract", () => {
  const geom = createTSlotPanelRetainerGeom(props)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  const bounds = [
    [-10, 0, 0],
    [10, 12, 25],
  ]
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(bounds[0]![axis]!, 8)
    expect(max[axis]).toBeCloseTo(bounds[1]![axis]!, 8)
  }
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
})
