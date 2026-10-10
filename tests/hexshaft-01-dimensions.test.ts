import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getHexShaftDimensions } from "@tscircuit/modelprinter"
import { createHexShaftGeom, createHexShaftMesh } from "../lib/models/hexshaft"
const props = {
  acrossFlats: 12,
  length: 200,
  endChamfer: 1,
  regularHex: true,
} as const
test("hexshaft preserves the documented envelope and attachment datum", () => {
  const d = getHexShaftDimensions(props)
  const [min, max] = jscad.measurements.measureBoundingBox(
    createHexShaftGeom(props),
  )
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(d.min[axis]!, 7)
    expect(max[axis]).toBeCloseTo(d.max[axis]!, 7)
  }
})
