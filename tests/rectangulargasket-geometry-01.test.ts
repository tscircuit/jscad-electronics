import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getRectangularGasketDimensions } from "@tscircuit/modelprinter"
import { createRectangularGasketGeom } from "../lib/models/rectangulargasket"
import { rectangularGasketProps as p } from "./fixtures/rectangulargasket-example"
test("rectangulargasket preserves nominal bounds and installation datum", () => {
  const d = getRectangularGasketDimensions(p),
    geom = createRectangularGasketGeom(p)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(d.size[axis]!, 6)
  expect(min[2]).toBeCloseTo(d.bottomZ, 6)
  expect(max[2]).toBeCloseTo(d.topZ, 6)
})
