import { expect, test } from "bun:test"
import { createFlatGasketMesh } from "../lib/models/flatgasket"
import {
  flatGasketProps as p,
  assertFlatGasketRayHits,
} from "./fixtures/flatgasket-example"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
test("flatgasket has actual fitting openings and retained material", () => {
  const mesh = createFlatGasketMesh(p)
  expect(raySurfaceHits(mesh, [0, 0, -5], [0, 0, 1])).toEqual([])
  assertFlatGasketRayHits(raySurfaceHits(mesh, [13, 0, -5], [0, 0, 1]), [5, 7])
  const changed = createFlatGasketMesh({ ...p, innerDiameter: 24 })
  expect(raySurfaceHits(changed, [11, 0, -5], [0, 0, 1])).toEqual([])
  assertFlatGasketRayHits(raySurfaceHits(mesh, [11, 0, -5], [0, 0, 1]), [5, 7])
})
