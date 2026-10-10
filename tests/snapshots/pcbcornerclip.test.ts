import { test } from "bun:test"
import { getPcbCornerClipDimensions } from "@tscircuit/modelprinter"
import { createPcbCornerClipMesh } from "../../lib/models/pcbcornerclip/geometry"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("pcbcornerclip standard four-view visual snapshot", async () => {
  const p = {
    width: 16,
    depth: 16,
    height: 8,
    wallThickness: 3,
    floorThickness: 2,
    boardThickness: 1.6,
    grooveDepth: 2,
    slotBottomZ: 3,
    holeDiameter: 3,
  }
  const d = getPcbCornerClipDimensions(p),
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
    mesh: createPcbCornerClipMesh(p),
    title: "PcbCornerClip",
    modelString:
      "pcbcornerclip_w16mm_d16mm_h8mm_wall3mm_floor2mm_board1.6mm_lip2mm_slotz3mm_hole3mm",
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
