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
test("hollowshaft renderer validates fit before constructing geometry", () => {
  for (const invalid of [
    { innerDiameter: 20 },
    { endChamfer: 2 },
    { length: 2 },
  ]) {
    expect(() => createHollowShaftGeom({ ...props, ...invalid })).toThrow()
    expect(() => createHollowShaftMesh({ ...props, ...invalid })).toThrow()
  }
})
