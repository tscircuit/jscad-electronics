import { test } from "bun:test"
import { getCableTieBaseDimensions } from "@tscircuit/modelprinter"
import { createCableTieBaseMesh } from "../../lib/models/cabletiebase/geometry"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("cabletiebase standard four-view visual snapshot", async () => {
  const p = {
    width: 24,
    depth: 24,
    height: 5,
    slotWidth: 4,
    slotHeight: 2,
    floorThickness: 1,
    holeDiameter: 3,
  }
  const d = getCableTieBaseDimensions(p),
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
    mesh: createCableTieBaseMesh(p),
    title: "CableTieBase",
    modelString:
      "cabletiebase_w24mm_d24mm_h5mm_slotw4mm_sloth2mm_floor1mm_hole3mm",
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
        span,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
