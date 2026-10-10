import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getTSlotCoverStripDimensions } from "@tscircuit/modelprinter"
import {
  createTSlotCoverStripGeom,
  createTSlotCoverStripMesh,
} from "../lib/models/tslotcoverstrip"
const props = {
  length: 100,
  width: 8,
  thickness: 1,
  stemWidth: 5.8,
  stemHeight: 2,
  barbWidth: 6.2,
  barbHeight: 0.5,
  tee: true,
} as const
test("tslotcoverstrip preserves the documented envelope and attachment datum", () => {
  const d = getTSlotCoverStripDimensions(props)
  const [min, max] = jscad.measurements.measureBoundingBox(
    createTSlotCoverStripGeom(props),
  )
  for (let axis = 0; axis < 3; axis++) {
    expect(min[axis]).toBeCloseTo(d.min[axis]!, 7)
    expect(max[axis]).toBeCloseTo(d.max[axis]!, 7)
  }
})
