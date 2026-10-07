import { expect, test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createClampingShaftCollarMesh } from "../lib/models/clampingshaftcollar"
import {
  assertClosedShaftMount,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"
import { example, mesh } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: exact model produces one closed, outward mesh with nominal bounds", () => {
  const model = mp.string(example).json()
  if (model.fn !== "clampingshaftcollar") throw new Error("Wrong family")
  const { fn, ...input } = model
  const result = mesh()
  expect(createClampingShaftCollarMesh(input)).toEqual(result)
  const volume = assertClosedShaftMount(result)
  expect(volume).toBeLessThan(Math.PI * (9 ** 2 - 4 ** 2) * 9)
  const bounds = meshBounds(result)
  expect(bounds.minimum[0]).toBeCloseTo(-9, 5)
  expect(bounds.maximum[0]).toBeLessThan(9)
  expect(bounds.maximum[0]).toBeGreaterThan(Math.sqrt(9 ** 2 - 0.5 ** 2) - 0.02)
  expect(bounds.minimum[1]).toBeCloseTo(-9, 5)
  expect(bounds.maximum[1]).toBeCloseTo(9, 5)
  expect(bounds.minimum[2]).toBeCloseTo(0, 5)
  expect(bounds.maximum[2]).toBeCloseTo(9, 5)
  expect(meshRayHits(result, [0, 0, -1], [0, 0, 1])).toEqual([])
})
