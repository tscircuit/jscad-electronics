import { expect, test } from "bun:test"
import { nemaMotorMountModelPropsSchema } from "@tscircuit/modelprinter"
import { createNemaMotorMountMesh } from "../lib/models/nemamotormount"
import {
  assertClosedShaftMount,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"

test("nemamotormount drives custom bracket dimensions, thickness and all bore layouts", () => {
  const p = nemaMotorMountModelPropsSchema.parse({
    nemaSize: 23,
    width: "8cm",
    height: 100,
    thickness: 6,
    baseDepth: 65,
    axisHeight: 45,
    mountingHoleDiameter: 6,
    shaftClearanceDiameter: 40,
    baseHoleDiameter: 8,
    baseHoleSpacing: 50,
    baseHoleOffset: 35,
  })
  const mesh = createNemaMotorMountMesh(p)
  assertClosedShaftMount(mesh)
  const { minimum, maximum } = meshBounds(mesh)
  expect({ minimum, maximum }).toEqual({
    minimum: [-40, -45, -65],
    maximum: [40, 55, 6],
  })
  expect(meshRayHits(mesh, [25, -38, -35], [0, -1, 0])).toEqual([])
  for (const hits of [
    meshRayHits(mesh, [25, -38, -25], [0, -1, 0]),
    meshRayHits(mesh, [30, 0, -1], [0, 0, 1]),
  ]) {
    expect(hits).toHaveLength(2)
    expect(hits[0]).toBeCloseTo(1, 8)
    expect(hits[1]).toBeCloseTo(7, 8)
  }
})
