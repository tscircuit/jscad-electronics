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
import { assertClosedMesh } from "./fixtures/tslotcoverstrip-assertions"
test("tslotcoverstrip triangulation is finite, closed, consistently wound and outward", () => {
  assertClosedMesh(createTSlotCoverStripMesh(props))
})
