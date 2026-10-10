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
test("hexshaft renderer validates fit before constructing geometry", () => {
  for (const invalid of [{ endChamfer: 6 }, { length: 2 }]) {
    expect(() => createHexShaftGeom({ ...props, ...invalid })).toThrow()
    expect(() => createHexShaftMesh({ ...props, ...invalid })).toThrow()
  }
})
