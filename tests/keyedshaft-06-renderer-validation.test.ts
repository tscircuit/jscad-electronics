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
test("keyedshaft renderer validates fit before constructing geometry", () => {
  for (const invalid of [
    { keyWidth: 20 },
    { keyDepth: 10 },
    { keyDepth: 0.1 },
    { keyLength: 249 },
    { endChamfer: 10 },
  ]) {
    expect(() => createKeyedShaftGeom({ ...props, ...invalid })).toThrow()
    expect(() => createKeyedShaftMesh({ ...props, ...invalid })).toThrow()
  }
})
