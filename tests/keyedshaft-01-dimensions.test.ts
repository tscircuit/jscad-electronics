import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getKeyedShaftDimensions } from "@tscircuit/modelprinter"
import {
  createKeyedShaftGeom,
  createKeyedShaftMesh,
} from "../lib/models/keyedshaft"
const props = {
  diameter: 20,
  length: 250,
  keyWidth: 6,
  keyDepth: 3,
  keyLength: 200,
  endChamfer: 1,
} as const
test("keyedshaft preserves the documented envelope and attachment datum", () => {
  const d = getKeyedShaftDimensions(props)
  const [min, max] = jscad.measurements.measureBoundingBox(
    createKeyedShaftGeom(props),
  )
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(d.min[axis]!, 7)
    expect(max[axis]).toBeCloseTo(d.max[axis]!, 7)
  }
})
