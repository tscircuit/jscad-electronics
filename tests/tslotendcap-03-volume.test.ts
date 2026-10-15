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
test("tslotendcap volume agrees with the independently derived material volume", () => {
  const expected =
    (props.width * props.height - (4 - Math.PI) * props.cornerRadius ** 2) *
      props.thickness +
    Math.PI * (props.pinDiameter / 2) ** 2 * props.pinLength
  const actual = jscad.measurements.measureVolume(createTSlotEndCapGeom(props))
  expect(Math.abs(actual - expected) / expected).toBeLessThan(0.001)
})
