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
import { assertClosedMesh } from "./fixtures/tslotendcap-assertions"
test("tslotendcap triangulation is finite, closed, consistently wound and outward", () => {
  assertClosedMesh(createTSlotEndCapMesh(props))
})
