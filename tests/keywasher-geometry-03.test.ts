import { expect, test } from "bun:test"
import { createKeyWasherMesh } from "../lib/models/keywasher"
import {
  keyWasherProps as p,
  assertKeyWasherRayHits,
} from "./fixtures/keywasher-example"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
test("keywasher has actual fitting openings and retained material", () => {
  const mesh = createKeyWasherMesh(p)
  expect(raySurfaceHits(mesh, [0, 0, -5], [0, 0, 1])).toEqual([])
  assertKeyWasherRayHits(raySurfaceHits(mesh, [4, 0, -5], [0, 0, 1]), [5, 6])
  expect(raySurfaceHits(mesh, [-4, 0, -5], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh, [4, 2, -5], [0, 0, 1])).toEqual([])
  assertKeyWasherRayHits(raySurfaceHits(mesh, [7, 0, -5], [0, 0, 1]), [5, 6])
})
