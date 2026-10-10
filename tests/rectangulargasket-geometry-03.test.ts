import { expect, test } from "bun:test"
import { createRectangularGasketMesh } from "../lib/models/rectangulargasket"
import {
  rectangularGasketProps as p,
  assertRectangularGasketRayHits,
} from "./fixtures/rectangulargasket-example"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
test("rectangulargasket has actual fitting openings and retained material", () => {
  const mesh = createRectangularGasketMesh(p)
  expect(raySurfaceHits(mesh, [0, 0, -5], [0, 0, 1])).toEqual([])
  assertRectangularGasketRayHits(
    raySurfaceHits(mesh, [37, 0, -5], [0, 0, 1]),
    [5, 7],
  )
  assertRectangularGasketRayHits(
    raySurfaceHits(mesh, [38, 23, -5], [0, 0, 1]),
    [5, 7],
  )
  expect(raySurfaceHits(mesh, [39.8, 24.8, -5], [0, 0, 1])).toEqual([])
})
