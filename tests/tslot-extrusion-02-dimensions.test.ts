import { expect, test } from "bun:test"
import { tSlotExtrusionModelPropsSchema } from "@tscircuit/modelprinter"
import { createTSlotExtrusionMesh } from "../lib/TSlotExtrusion"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"

test("T-slot extrusion defaults, unequal sections and unit inputs preserve the contract", () => {
  for (const input of [
    {},
    {
      width: "3cm",
      height: "2.4cm",
      length: "1in",
      boreDiameter: 5,
      cornerRadius: 2,
    },
  ]) {
    const props = tSlotExtrusionModelPropsSchema.parse(input)
    const mesh = createTSlotExtrusionMesh(input)
    assertClosedMesh(mesh)
    expect(meshBounds(mesh).minimum).toEqual([
      -props.width / 2,
      -props.height / 2,
      0,
    ])
    expect(meshBounds(mesh).maximum).toEqual([
      props.width / 2,
      props.height / 2,
      props.length,
    ])
  }
  expect(
    raySurfaceHits(createTSlotExtrusionMesh(), [0, 0, -1], [0, 0, 1]),
  ).toEqual([1, 101])
  expect(
    raySurfaceHits(createTSlotExtrusionMesh(), [9.8, 9.8, -1], [0, 0, 1]),
  ).toEqual([1, 101])
  expect(() => createTSlotExtrusionMesh({ pocketDepth: 3 })).toThrow()
})
