import { expect, test } from "bun:test"
import {
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { mesh } from "./fixtures/shaft-collar-case"

test("shaftcollar: radial hole fully connects the axial bore and preserves the opposite wall", () => {
  const result = mesh()
  expect(meshRayHits(result, [0, 0, 4], [1, 0, 0])).toEqual([])
  const opposite = meshRayHits(result, [0, 0, 4], [-1, 0, 0])
  expect(opposite[0]).toBeCloseTo(4, 5)
  expect(opposite[1]).toBeCloseTo(8, 5)
  expect(containsMeshPoint(result, [6, 0, 4])).toBe(false)
  expect(containsMeshPoint(result, [-6, 0, 4])).toBe(true)
  expect(containsMeshPoint(result, [6, 0, 6.5])).toBe(true)
})
