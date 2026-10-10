import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getSplitGrommetDimensions } from "@tscircuit/modelprinter"
import { createSplitGrommetGeom } from "../lib/models/splitgrommet"
import { splitGrommetProps as p } from "./fixtures/splitgrommet-example"
test("splitgrommet preserves nominal bounds and installation datum", () => {
  const d = getSplitGrommetDimensions(p),
    geom = createSplitGrommetGeom(p)
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  expect(min[0]).toBeCloseTo(-p.outerDiameter / 2, 6)
  expect(max[0]).toBeCloseTo(
    Math.sqrt((p.outerDiameter / 2) ** 2 - (p.splitWidth / 2) ** 2),
    6,
  )
  expect(max[1]! - min[1]!).toBeCloseTo(p.outerDiameter, 6)
  expect(max[2]! - min[2]!).toBeCloseTo(p.height, 6)
  expect(min[2]).toBeCloseTo(d.bottomZ, 6)
  expect(max[2]).toBeCloseTo(d.topZ, 6)
})
