import { test } from "bun:test"
import { getPottingBoxDimensions } from "@tscircuit/modelprinter"
import { createPottingBoxMesh } from "../../lib/models/pottingbox/geometry"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("pottingbox standard four-view visual snapshot", async () => {
  const p = {
    width: 60,
    depth: 40,
    height: 25,
    wallThickness: 1.5,
    floorThickness: 1.5,
    earLength: 10,
    earWidth: 12,
    holeDiameter: 3,
    holePitch: 70,
  }
  const d = getPottingBoxDimensions(p),
    span = Math.max(...d.size) * 1.6
  const target = d.bounds[0].map((x, i) => (x + d.bounds[1][i]!) / 2) as [
    number,
    number,
    number,
  ]
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  const png = await renderModelSnapshot({
    mesh: createPottingBoxMesh(p),
    title: "PottingBox",
    modelString:
      "pottingbox_w60mm_d40mm_h25mm_wall1.5mm_floor1.5mm_earl10mm_earw12mm_hole3mm_hp70mm",
    footer: "mm / MOUNTING UNDERSIDE Z=0 / CUSTOM GEOMETRY",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Complete mounting geometry",
        eye: eye(1, 1, 1),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "Looking down Z",
        eye: eye(0, 0, 2),
        target,
        span,
      },
      {
        name: "FRONT",
        detail: "Looking from negative Y",
        eye: eye(0, -2, 0),
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "Looking from positive X",
        eye: eye(2, 0, 0),
        target,
        span: Math.max(d.size[1], d.size[2]) * 1.6,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
