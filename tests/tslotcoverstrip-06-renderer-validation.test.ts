import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getTSlotCoverStripDimensions } from "@tscircuit/modelprinter"
import {
  createTSlotCoverStripGeom,
  createTSlotCoverStripMesh,
} from "../lib/models/tslotcoverstrip"
const props = {
  length: 100,
  width: 8,
  thickness: 1,
  stemWidth: 5.8,
  stemHeight: 2,
  barbWidth: 6.2,
  barbHeight: 0.5,
  tee: true,
} as const
test("tslotcoverstrip renderer validates fit before constructing geometry", () => {
  for (const invalid of [
    { stemWidth: 6.2 },
    { barbWidth: 8 },
    { barbHeight: 2 },
  ]) {
    expect(() => createTSlotCoverStripGeom({ ...props, ...invalid })).toThrow()
    expect(() => createTSlotCoverStripMesh({ ...props, ...invalid })).toThrow()
  }
})
