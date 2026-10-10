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
test("keyedshaft volume agrees with the independently derived material volume", () => {
  const r = props.diameter / 2,
    c = props.endChamfer,
    a = props.keyWidth / 2
  const blank =
    Math.PI *
    (r * r * (props.length - 2 * c) +
      (2 * c * (r * r + r * (r - c) + (r - c) ** 2)) / 3)
  const keyArea =
    a * Math.sqrt(r * r - a * a) +
    r * r * Math.asin(a / r) -
    2 * a * (r - props.keyDepth)
  const expected = blank - keyArea * props.keyLength
  const actual = jscad.measurements.measureVolume(createKeyedShaftGeom(props))
  expect(Math.abs(actual - expected) / expected).toBeLessThan(0.001)
})
