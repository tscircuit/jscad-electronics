import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getCornerFootDimensions } from "@tscircuit/modelprinter"
import { createCornerFootGeom } from "../lib/models/cornerfoot"
import { cornerFootProps as p } from "./fixtures/cornerfoot-example"
test("cornerfoot preserves nominal bounds and installation datum", () => {
  const d = getCornerFootDimensions(p),
    geom = createCornerFootGeom(p)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(d.size[axis]!, 6)
  expect(min[2]).toBeCloseTo(d.bottomZ, 6)
  expect(max[2]).toBeCloseTo(d.topZ, 6)
})
