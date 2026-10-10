import { expect, test } from "bun:test"
import { createCornerFootMesh } from "../lib/models/cornerfoot"
import {
  cornerFootProps as p,
  assertCornerFootRayHits,
} from "./fixtures/cornerfoot-example"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
test("cornerfoot has actual fitting openings and retained material", () => {
  const mesh = createCornerFootMesh(p)
  expect(raySurfaceHits(mesh, [0, 0, -5], [0, 0, 1])).toEqual([])
  assertCornerFootRayHits(raySurfaceHits(mesh, [4, 4, -5], [0, 0, 1]), [5, 8])
  assertCornerFootRayHits(
    raySurfaceHits(mesh, [-11, 4, -5], [0, 0, 1]),
    [5, 17],
  )
  assertCornerFootRayHits(
    raySurfaceHits(mesh, [4, -11, -5], [0, 0, 1]),
    [5, 17],
  )
  expect(raySurfaceHits(mesh, [-9.4, 4, 6], [1, 0, 0])).toEqual([])
})
