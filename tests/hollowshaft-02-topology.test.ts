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
import { assertClosedMesh } from "./fixtures/hollowshaft-assertions"
test("hollowshaft triangulation is finite, closed, consistently wound and outward", () => {
  assertClosedMesh(createHollowShaftMesh(props))
  assertClosedMesh(createHollowShaftMesh({ ...props, endChamfer: 0 }))
})
