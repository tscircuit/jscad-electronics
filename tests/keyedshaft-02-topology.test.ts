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
import { assertClosedMesh } from "./fixtures/keyedshaft-assertions"
test("keyedshaft triangulation is finite, closed, consistently wound and outward", () => {
  assertClosedMesh(createKeyedShaftMesh(props))
  assertClosedMesh(createKeyedShaftMesh({ ...props, endChamfer: 0 }))
})
