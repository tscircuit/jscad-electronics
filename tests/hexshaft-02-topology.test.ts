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
import { assertClosedMesh } from "./fixtures/hexshaft-assertions"
test("hexshaft triangulation is finite, closed, consistently wound and outward", () => {
  assertClosedMesh(createHexShaftMesh(props))
  assertClosedMesh(createHexShaftMesh({ ...props, endChamfer: 0 }))
})
