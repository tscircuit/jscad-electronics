import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getFlatGasketDimensions } from "@tscircuit/modelprinter"
import { createFlatGasketGeom } from "../lib/models/flatgasket"
import { flatGasketProps as p } from "./fixtures/flatgasket-example"
test("flatgasket preserves nominal bounds and installation datum", () => {
  const d = getFlatGasketDimensions(p),
    geom = createFlatGasketGeom(p)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(d.size[axis]!, 6)
  expect(min[2]).toBeCloseTo(d.bottomZ, 6)
  expect(max[2]).toBeCloseTo(d.topZ, 6)
})
