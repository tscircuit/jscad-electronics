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
test("tslotcoverstrip volume agrees with the independently derived material volume", () => {
  const expected =
    (props.width * props.thickness +
      props.stemWidth * (props.stemHeight - props.barbHeight) +
      props.barbWidth * props.barbHeight) *
    props.length
  const actual = jscad.measurements.measureVolume(
    createTSlotCoverStripGeom(props),
  )
  expect(Math.abs(actual - expected) / expected).toBeLessThan(0.001)
})
