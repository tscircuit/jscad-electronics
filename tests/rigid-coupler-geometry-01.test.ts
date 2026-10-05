import { expect, test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createRigidCouplerMesh } from "../lib/models/rigidcoupler"
import {
  assertClosedShaftMount,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"
import { example, mesh } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: exact model produces one closed, outward mesh with nominal bounds", () => {
  const model = mp.string(example).json()
  if (model.fn !== "rigidcoupler") throw new Error("Wrong family")
  const { fn, ...input } = model
  const result = mesh()
  expect(createRigidCouplerMesh(input)).toEqual(result)
  const volume = assertClosedShaftMount(result)
  expect(volume).toBeLessThan(Math.PI * (10 ** 2 - 4 ** 2) * 25)
  const bounds = meshBounds(result)
  expect(bounds.minimum[0]).toBeCloseTo(-10, 5)
  expect(bounds.maximum[0]).toBeCloseTo(10, 5)
  expect(bounds.minimum[1]).toBeCloseTo(-10, 5)
  expect(bounds.maximum[1]).toBeCloseTo(10, 5)
  expect(bounds.minimum[2]).toBeCloseTo(0, 5)
  expect(bounds.maximum[2]).toBeCloseTo(25, 5)
  expect(meshRayHits(result, [0, 0, -1], [0, 0, 1])).toEqual([])
})
