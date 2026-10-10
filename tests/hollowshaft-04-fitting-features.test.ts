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
import { containsPoint } from "./fixtures/hollowshaft-assertions"
test("hollowshaft defining fitting features remove and retain the expected material", () => {
  const mesh = createHollowShaftMesh(props)
  const ri = props.innerDiameter / 2,
    ro = props.outerDiameter / 2
  for (let i = 0; i < 64; i++) {
    const angle = (2 * Math.PI * (i + 0.37)) / 64
    const at = (r: number, z: number): [number, number, number] => [
      r * Math.cos(angle),
      r * Math.sin(angle),
      z,
    ]
    expect(containsPoint(mesh, at(ri * 0.999, props.length / 2))).toBe(false)
    expect(containsPoint(mesh, at((ri + ro) / 2, props.length / 2))).toBe(true)
    expect(
      containsPoint(
        mesh,
        at(ri + props.endChamfer * 0.8, props.endChamfer * 0.1),
      ),
    ).toBe(false)
    expect(
      containsPoint(
        mesh,
        at(ro - props.endChamfer * 0.1, props.endChamfer * 0.1),
      ),
    ).toBe(false)
  }
  expect(containsPoint(mesh, [0, 0, 0.1])).toBe(false)
  expect(containsPoint(mesh, [0, 0, props.length - 0.1])).toBe(false)
})
