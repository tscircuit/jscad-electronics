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
import { containsPoint } from "./fixtures/keyedshaft-assertions"
test("keyedshaft defining fitting features remove and retain the expected material", () => {
  const mesh = createKeyedShaftMesh(props)
  const r = props.diameter / 2
  const floor = r - props.keyDepth
  const middle = props.length / 2
  expect(containsPoint(mesh, [0, floor + 0.05, middle])).toBe(false)
  expect(containsPoint(mesh, [0, floor - 0.05, middle])).toBe(true)
  expect(
    containsPoint(mesh, [props.keyWidth / 2 + 0.05, floor + 0.05, middle]),
  ).toBe(true)
  expect(containsPoint(mesh, [0, r - 0.05, 10])).toBe(true)
  expect(containsPoint(mesh, [r - 0.1, 0, 0.1])).toBe(false)
  expect(containsPoint(mesh, [r - props.endChamfer - 0.1, 0, 0.1])).toBe(true)
})
