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
import { containsPoint } from "./fixtures/hexshaft-assertions"
test("hexshaft defining fitting features remove and retain the expected material", () => {
  const mesh = createHexShaftMesh(props)
  expect(
    containsPoint(mesh, [props.acrossFlats / 2 - 0.05, 0, props.length / 2]),
  ).toBe(true)
  expect(
    containsPoint(mesh, [props.acrossFlats / 2 + 0.05, 0, props.length / 2]),
  ).toBe(false)
  expect(containsPoint(mesh, [props.acrossFlats / 2 - 0.1, 0, 0.1])).toBe(false)
  expect(
    containsPoint(mesh, [
      props.acrossFlats / 2 - props.endChamfer - 0.1,
      0,
      0.1,
    ]),
  ).toBe(true)
  const tipXs = mesh.positions.filter(
    (_, index) =>
      index % 3 === 0 && Math.abs(mesh.positions[index + 2]!) < 1e-9,
  )
  expect(Math.max(...tipXs)).toBeCloseTo(
    (props.acrossFlats - 2 * props.endChamfer) / 2,
    8,
  )
})
