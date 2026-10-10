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
test("hexshaft volume agrees with the independently derived material volume", () => {
  const area = (Math.sqrt(3) / 2) * props.acrossFlats ** 2
  const endArea =
    (Math.sqrt(3) / 2) * (props.acrossFlats - 2 * props.endChamfer) ** 2
  const expected =
    area * (props.length - 2 * props.endChamfer) +
    ((2 * props.endChamfer) / 3) * (area + Math.sqrt(area * endArea) + endArea)
  const actual = jscad.measurements.measureVolume(createHexShaftGeom(props))
  expect(Math.abs(actual - expected) / expected).toBeLessThan(0.001)
})
