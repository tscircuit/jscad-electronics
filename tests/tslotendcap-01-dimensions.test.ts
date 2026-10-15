import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getTSlotEndCapDimensions } from "@tscircuit/modelprinter"
import {
  createTSlotEndCapGeom,
  createTSlotEndCapMesh,
} from "../lib/models/tslotendcap"
const props = {
  width: 20,
  height: 20,
  thickness: 3,
  cornerRadius: 1,
  pinDiameter: 3.8,
  pinLength: 6,
  pinCount: 1,
  centered: true,
} as const
test("tslotendcap preserves the documented envelope and attachment datum", () => {
  const d = getTSlotEndCapDimensions(props)
  const [min, max] = jscad.measurements.measureBoundingBox(
    createTSlotEndCapGeom(props),
  )
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(d.min[axis]!, 7)
    expect(max[axis]).toBeCloseTo(d.max[axis]!, 7)
  }
})
