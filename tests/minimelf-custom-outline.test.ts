import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { MINIMELF } from "../lib/MINIMELF"
import { getComponentModel } from "./helpers/component-model"

test("custom MiniMELF dimensions describe the complete case", () => {
  const { geometries } = getComponentModel(MINIMELF, {
    bodyLength: 4.2,
    bodyDiameter: 1.8,
  })
  const [min, max] = jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map(({ geom }) => geom),
  )
  expect(max[0] - min[0]).toBeCloseTo(4.2, 5)
  expect(max[2] - min[2]).toBeCloseTo(1.84, 5)
})
