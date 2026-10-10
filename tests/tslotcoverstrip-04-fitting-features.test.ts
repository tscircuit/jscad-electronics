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
import { containsPoint } from "./fixtures/tslotcoverstrip-assertions"
test("tslotcoverstrip defining fitting features remove and retain the expected material", () => {
  const mesh = createTSlotCoverStripMesh(props)
  const middle = props.length / 2
  const stemY = -(props.stemHeight - props.barbHeight) / 2
  const beadY = -props.stemHeight + props.barbHeight / 2
  expect(
    containsPoint(mesh, [props.width / 2 - 0.05, props.thickness / 2, middle]),
  ).toBe(true)
  expect(containsPoint(mesh, [0, stemY, middle])).toBe(true)
  expect(containsPoint(mesh, [props.stemWidth / 2 + 0.05, stemY, middle])).toBe(
    false,
  )
  expect(containsPoint(mesh, [props.barbWidth / 2 - 0.05, beadY, middle])).toBe(
    true,
  )
  expect(containsPoint(mesh, [props.barbWidth / 2 + 0.05, beadY, middle])).toBe(
    false,
  )
})
