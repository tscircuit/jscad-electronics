import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getTSlotEndCapDimensions } from "@tscircuit/modelprinter"
import {
  createTSlotEndCapGeom,
  createTSlotEndCapMesh,
} from "../lib/models/tslotendcap"
const props = {
  width: 20,
  height: 20,
  thickness: 3,
  cornerRadius: 1,
  pinDiameter: 3.8,
  pinLength: 6,
  pinCount: 1,
  centered: true,
} as const
test("tslotendcap renderer validates fit before constructing geometry", () => {
  for (const invalid of [
    { cornerRadius: 10 },
    { pinDiameter: 20 },
    { pinCount: 2 },
    { centered: false },
  ]) {
    expect(() =>
      createTSlotEndCapGeom({ ...props, ...invalid } as unknown as Parameters<
        typeof createTSlotEndCapGeom
      >[0]),
    ).toThrow()
    expect(() =>
      createTSlotEndCapMesh({ ...props, ...invalid } as unknown as Parameters<
        typeof createTSlotEndCapMesh
      >[0]),
    ).toThrow()
  }
})
