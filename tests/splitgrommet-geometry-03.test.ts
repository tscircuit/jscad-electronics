import { expect, test } from "bun:test"
import { createSplitGrommetMesh } from "../lib/models/splitgrommet"
import {
  splitGrommetProps as p,
  assertSplitGrommetRayHits,
} from "./fixtures/splitgrommet-example"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
test("splitgrommet has actual fitting openings and retained material", () => {
  const mesh = createSplitGrommetMesh(p)
  expect(raySurfaceHits(mesh, [0, 0, -10], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh, [10, 0, -10], [0, 0, 1])).toEqual([])
  assertSplitGrommetRayHits(
    raySurfaceHits(mesh, [-10, 0, -10], [0, 0, 1]),
    [5.5, 14.5],
  )
  assertSplitGrommetRayHits(
    raySurfaceHits(mesh, [-14, 0, -10], [0, 0, 1]),
    [5.5, 8.5, 11.5, 14.5],
  )
  const narrow = createSplitGrommetMesh({ ...p, splitWidth: 0.4 })
  assertSplitGrommetRayHits(
    raySurfaceHits(narrow, [10, 0.3, -10], [0, 0, 1]),
    [5.5, 14.5],
  )
  expect(raySurfaceHits(mesh, [10, 0.3, -10], [0, 0, 1])).toEqual([])
})
