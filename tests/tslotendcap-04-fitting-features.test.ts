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
import { containsPoint } from "./fixtures/tslotendcap-assertions"
test("tslotendcap defining fitting features remove and retain the expected material", () => {
  const mesh = createTSlotEndCapMesh(props)
  expect(containsPoint(mesh, [0, 0, -props.pinLength / 2])).toBe(true)
  expect(containsPoint(mesh, [0, 0, -0.01])).toBe(true)
  expect(containsPoint(mesh, [0, 0, 0.01])).toBe(true)
  expect(
    containsPoint(mesh, [
      props.pinDiameter / 2 + 0.05,
      0,
      -props.pinLength / 2,
    ]),
  ).toBe(false)
  expect(
    containsPoint(mesh, [
      props.width / 2 - 0.01,
      props.height / 2 - 0.01,
      props.thickness / 2,
    ]),
  ).toBe(false)
  expect(
    containsPoint(mesh, [
      props.width / 2 - props.cornerRadius - 0.05,
      0,
      props.thickness / 2,
    ]),
  ).toBe(true)
})
