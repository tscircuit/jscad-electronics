import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getPottingBoxDimensions } from "@tscircuit/modelprinter"
import {
  createPottingBoxGeom,
  createPottingBoxMesh,
} from "../lib/models/pottingbox/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/pottingbox-example"

test("pottingbox fitting openings and supporting material", () => {
  const mesh = createPottingBoxMesh(p),
    d = getPottingBoxDimensions(p)
  for (const side of [-1, 1])
    expect(
      raySurfaceHits(mesh, [(side * p.holePitch) / 2, 0, -1], [0, 0, 1]),
    ).toHaveLength(0)
  const cavity = raySurfaceHits(mesh, [0, 0, p.height + 1], [0, 0, -1])
  expect(cavity).toHaveLength(2)
  expect(cavity[0]).toBeCloseTo(p.height + 1 - p.floorThickness, 7)
  const walls = raySurfaceHits(
    mesh,
    [-p.width, 0, (p.height + p.floorThickness) / 2],
    [1, 0, 0],
  )
  expect(walls).toHaveLength(4)
  expect(walls[1]! - walls[0]!).toBeCloseTo(p.wallThickness, 7)
  expect(walls[3]! - walls[2]!).toBeCloseTo(p.wallThickness, 7)
})
