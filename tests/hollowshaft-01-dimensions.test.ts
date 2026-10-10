import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getHollowShaftDimensions } from "@tscircuit/modelprinter"
import {
  createHollowShaftGeom,
  createHollowShaftMesh,
} from "../lib/models/hollowshaft"
const props = {
  outerDiameter: 20,
  innerDiameter: 12,
  length: 200,
  endChamfer: 1,
  roundTube: true,
} as const
test("hollowshaft preserves the documented envelope and attachment datum", () => {
  const d = getHollowShaftDimensions(props)
  const [min, max] = jscad.measurements.measureBoundingBox(
    createHollowShaftGeom(props),
  )
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(d.min[axis]!, 7)
    expect(max[axis]).toBeCloseTo(d.max[axis]!, 7)
  }
})
