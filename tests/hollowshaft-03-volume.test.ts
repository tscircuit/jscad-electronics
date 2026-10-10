import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getHollowShaftDimensions } from "@tscircuit/modelprinter"
import {
  createHollowShaftGeom,
  createHollowShaftMesh,
} from "../lib/models/hollowshaft"
const props = {
  outerDiameter: 20,
  innerDiameter: 12,
  length: 200,
  endChamfer: 1,
  roundTube: true,
} as const
test("hollowshaft volume agrees with the independently derived material volume", () => {
  const ro = props.outerDiameter / 2,
    ri = props.innerDiameter / 2
  const expected =
    Math.PI * (ro * ro - ri * ri) * props.length -
    2 * Math.PI * (ro + ri) * props.endChamfer ** 2
  const actual = jscad.measurements.measureVolume(createHollowShaftGeom(props))
  expect(Math.abs(actual - expected) / expected).toBeLessThan(0.001)
})
