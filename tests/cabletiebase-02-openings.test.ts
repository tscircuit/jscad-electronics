import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableTieBaseDimensions } from "@tscircuit/modelprinter"
import {
  createCableTieBaseGeom,
  createCableTieBaseMesh,
} from "../lib/models/cabletiebase/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/cabletiebase-example"

test("cabletiebase fitting openings and supporting material", () => {
  const mesh = createCableTieBaseMesh(p),
    d = getCableTieBaseDimensions(p)
  expect(raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])).toHaveLength(0)
  const tunnelZ = p.floorThickness + p.slotHeight / 2
  expect(raySurfaceHits(mesh, [-p.width, 0, tunnelZ], [1, 0, 0])).toHaveLength(
    0,
  )
  expect(raySurfaceHits(mesh, [0, -p.depth, tunnelZ], [0, 1, 0])).toHaveLength(
    0,
  )
  expect(
    raySurfaceHits(mesh, [p.width / 4, p.depth / 4, -1], [0, 0, 1]),
  ).toHaveLength(2)
})
