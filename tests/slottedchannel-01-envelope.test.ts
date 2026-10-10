import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { createSlottedChannelGeom } from "../lib/models/slottedchannel"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 1: envelope bounds and end datum match the contract", () => {
  const geom = createSlottedChannelGeom(props)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  const bounds = [
    [-20, -10, 0],
    [20, 10, 80],
  ]
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(bounds[0]![axis]!, 8)
    expect(max[axis]).toBeCloseTo(bounds[1]![axis]!, 8)
  }
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
})
