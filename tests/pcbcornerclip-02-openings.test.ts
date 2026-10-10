import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getPcbCornerClipDimensions } from "@tscircuit/modelprinter"
import {
  createPcbCornerClipGeom,
  createPcbCornerClipMesh,
} from "../lib/models/pcbcornerclip/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/pcbcornerclip-example"

test("pcbcornerclip fitting openings and supporting material", () => {
  const mesh = createPcbCornerClipMesh(p),
    d = getPcbCornerClipDimensions(p)
  expect(raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])).toHaveLength(0)
  const slotZ = p.slotBottomZ + p.boardThickness / 2
  const xGroove = raySurfaceHits(mesh, [0, 0, slotZ], [-1, 0, 0])
  const yGroove = raySurfaceHits(mesh, [0, 0, slotZ], [0, -1, 0])
  expect(xGroove).toHaveLength(2)
  expect(yGroove).toHaveLength(2)
  expect(xGroove[0]).toBeCloseTo(
    p.width / 2 - p.wallThickness + p.grooveDepth,
    7,
  )
  expect(yGroove[0]).toBeCloseTo(
    p.depth / 2 - p.wallThickness + p.grooveDepth,
    7,
  )
  const backX = -p.width / 2 + (p.wallThickness - p.grooveDepth) / 2
  expect(
    raySurfaceHits(mesh, [backX, -p.depth, slotZ], [0, 1, 0]),
  ).toHaveLength(2)
  const above = raySurfaceHits(
    mesh,
    [0, 0, d.slotTopZ + (p.height - d.slotTopZ) / 2],
    [-1, 0, 0],
  )
  expect(above[0]).toBeCloseTo(p.width / 2 - p.wallThickness, 7)
})
