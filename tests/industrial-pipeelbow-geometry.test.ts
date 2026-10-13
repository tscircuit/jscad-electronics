import { expect, test } from "bun:test"
import { createPipeElbowMesh } from "../lib/models/pipeelbow"
import {
  assertClosedShaftMount,
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"

test("pipeelbow: mitered flow junction has one closed oriented boundary with no tangent slivers", () => {
  for (const input of [
    {},
    { boreDiameter: 23 },
    { boreDiameter: 12 },
    { outerDiameter: 30, boreDiameter: 24, socketDiameter: 36, legLength: 60 },
    {
      outerDiameter: 12,
      boreDiameter: 6,
      socketDiameter: 16,
      legLength: 20,
      socketLength: 6,
    },
  ]) {
    assertClosedShaftMount(createPipeElbowMesh(input))
  }
})

test("pipeelbow: both open ports join inside a closed cast heel", () => {
  const mesh = createPipeElbowMesh({})
  for (const point of [
    [0, 0, 0],
    [20, 0, 0],
    [0, 20, 0],
  ] as const)
    expect(containsMeshPoint(mesh, point)).toBe(false)
  for (const point of [
    [-10, 0, 0],
    [0, -10, 0],
  ] as const)
    expect(containsMeshPoint(mesh, point)).toBe(true)
  expect(
    meshRayHits(mesh, [40, 0, 0], [-1, 0, 0]).filter(
      (distance) => distance < 40,
    ),
  ).toEqual([])
  expect(
    meshRayHits(mesh, [0, 40, 0], [0, -1, 0]).filter(
      (distance) => distance < 40,
    ),
  ).toEqual([])
})
