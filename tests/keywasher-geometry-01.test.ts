import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getKeyWasherDimensions } from "@tscircuit/modelprinter"
import { createKeyWasherGeom } from "../lib/models/keywasher"
import { keyWasherProps as p } from "./fixtures/keywasher-example"
test("keywasher preserves nominal bounds and installation datum", () => {
  const d = getKeyWasherDimensions(p),
    geom = createKeyWasherGeom(p)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(d.size[axis]!, 6)
  expect(min[2]).toBeCloseTo(d.bottomZ, 6)
  expect(max[2]).toBeCloseTo(d.topZ, 6)
})
