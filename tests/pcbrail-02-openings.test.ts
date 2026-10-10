import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getPcbRailDimensions } from "@tscircuit/modelprinter"
import {
  createPcbRailGeom,
  createPcbRailMesh,
} from "../lib/models/pcbrail/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/pcbrail-example"

test("pcbrail fitting openings and supporting material", () => {
  const mesh = createPcbRailMesh(p),
    d = getPcbRailDimensions(p)
  for (const side of [-1, 1])
    expect(
      raySurfaceHits(mesh, [(side * p.holePitch) / 2, 0, -1], [0, 0, 1]),
    ).toHaveLength(0)
  const startX = -p.length - p.tabLength
  expect(
    raySurfaceHits(
      mesh,
      [
        startX,
        -p.width / 2 + p.wallThickness - p.slotDepth / 2,
        p.slotBottomZ + p.slotWidth / 2,
      ],
      [1, 0, 0],
    ),
  ).toHaveLength(0)
  expect(
    raySurfaceHits(
      mesh,
      [
        startX,
        -p.width / 2 + (p.wallThickness - p.slotDepth) / 2,
        p.slotBottomZ + p.slotWidth / 2,
      ],
      [1, 0, 0],
    ),
  ).toHaveLength(2)
  expect(raySurfaceHits(mesh, [0, p.width / 4, -1], [0, 0, 1])).toHaveLength(2)
})
