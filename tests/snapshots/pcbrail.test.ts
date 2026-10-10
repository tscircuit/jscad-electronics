import { test } from "bun:test"
import { getPcbRailDimensions } from "@tscircuit/modelprinter"
import { createPcbRailMesh } from "../../lib/models/pcbrail/geometry"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("pcbrail standard four-view visual snapshot", async () => {
  const p = {
    length: 80,
    width: 12,
    height: 8,
    wallThickness: 3,
    floorThickness: 2,
    slotWidth: 1.8,
    slotDepth: 2,
    slotBottomZ: 4,
    tabLength: 8,
    tabWidth: 8,
    holeDiameter: 3,
    holePitch: 88,
  }
  const d = getPcbRailDimensions(p),
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
    mesh: createPcbRailMesh(p),
    title: "PcbRail",
    modelString:
      "pcbrail_l80mm_w12mm_h8mm_wall3mm_floor2mm_slotw1.8mm_slotd2mm_slotz4mm_tabl8mm_tabw8mm_hole3mm_hp88mm",
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
