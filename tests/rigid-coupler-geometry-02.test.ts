import { expect, test } from "bun:test"
import {
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { mesh } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: both orthogonal screw holes per end fully open into the shaft bores", () => {
  const result = mesh()
  for (const z of [6.25, 18.75]) {
    expect(meshRayHits(result, [0, 0, z], [1, 0, 0])).toEqual([])
    expect(meshRayHits(result, [0, 0, z], [0, 1, 0])).toEqual([])
    expect(containsMeshPoint(result, [-7, 0, z])).toBe(true)
  }
  expect(containsMeshPoint(result, [7, 0, 12.5])).toBe(true)
})
