import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableClampDimensions } from "@tscircuit/modelprinter"
import {
  createCableClampGeom,
  createCableClampMesh,
} from "../lib/models/cableclamp/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/cableclamp-example"

test("cableclamp fitting openings and supporting material", () => {
  const mesh = createCableClampMesh(p),
    d = getCableClampDimensions(p)
  expect(
    raySurfaceHits(mesh, [d.mountingHoleX, 0, -1], [0, 0, 1]),
  ).toHaveLength(0)
  expect(
    raySurfaceHits(mesh, [0, -p.bandWidth, d.ringCenterZ], [0, 1, 0]),
  ).toHaveLength(0)
  expect(
    raySurfaceHits(
      mesh,
      [p.innerDiameter / 2 + p.thickness / 2, -p.bandWidth, d.ringCenterZ],
      [0, 1, 0],
    ),
  ).toHaveLength(2)
  expect(
    raySurfaceHits(
      mesh,
      [d.mountingHoleX + p.holeDiameter * 0.75, 0, -1],
      [0, 0, 1],
    ),
  ).toHaveLength(2)
})
