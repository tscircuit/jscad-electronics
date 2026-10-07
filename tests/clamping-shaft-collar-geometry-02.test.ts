import { expect, test } from "bun:test"
import {
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { mesh } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: slit and two tangential hole halves are open, with a connected opposite arm", () => {
  const result = mesh()
  expect(meshRayHits(result, [6.5, -20, 4.5], [0, 1, 0])).toEqual([])
  expect(containsMeshPoint(result, [8.8, 0, 4.5])).toBe(false)
  expect(containsMeshPoint(result, [8.8, 0.8, 4.5])).toBe(true)
  expect(containsMeshPoint(result, [-6, 0, 4.5])).toBe(true)
  // Clearance radius is 2.25, larger than the 2 mm thread major radius.
  expect(containsMeshPoint(result, [8.65, -2, 4.5])).toBe(false)
  expect(containsMeshPoint(result, [8.65, 1, 4.5])).toBe(true)
})
