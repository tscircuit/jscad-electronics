import { expect, test } from "bun:test"
import { tSlotInsideCornerModelPropsSchema } from "@tscircuit/modelprinter"
import { createTSlotInsideCornerMesh } from "../lib/models/tslotinsidecorner"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

test("T-slot inside corner sharp-inside default and inch inputs retain welded seams", () => {
  for (const input of [
    {},
    {
      width: "1in",
      legLength: "2in",
      thickness: "0.1in",
      bendRadius: "0.2in",
      holeDiameter: "0.2in",
      holeOffset: "1in",
    },
  ]) {
    const props = tSlotInsideCornerModelPropsSchema.parse(input)
    const mesh = createTSlotInsideCornerMesh(input)
    assertClosedMesh(mesh)
    expect(meshBounds(mesh).minimum).toEqual([
      -props.thickness,
      -props.width / 2,
      -props.thickness,
    ])
    expect(meshBounds(mesh).maximum).toEqual([
      props.legLength,
      props.width / 2,
      props.legLength,
    ])
  }
  expect(() => createTSlotInsideCornerMesh({ holeOffset: 2 })).toThrow()
})
