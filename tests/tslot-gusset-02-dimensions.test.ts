import { expect, test } from "bun:test"
import { tSlotGussetModelPropsSchema } from "@tscircuit/modelprinter"
import { createTSlotGussetMesh } from "../lib/TSlotGusset"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

test("T-slot gusset defaults, unequal triangles, unit tuples and round slots are closed", () => {
  for (const input of [
    {},
    {
      width: "5cm",
      height: "4.5cm",
      thickness: "0.1in",
      slot: ["0.5cm", "1.2cm"] as [string, string],
    },
    { slot: [5, 5] as [number, number] },
  ]) {
    const props = tSlotGussetModelPropsSchema.parse(input)
    const mesh = createTSlotGussetMesh(input)
    assertClosedMesh(mesh)
    expect(meshBounds(mesh).minimum).toEqual([0, 0, 0])
    expect(meshBounds(mesh).maximum).toEqual([
      props.width,
      props.height,
      props.thickness,
    ])
  }
  expect(() => createTSlotGussetMesh({ centers: [12, 31] })).toThrow()
})
