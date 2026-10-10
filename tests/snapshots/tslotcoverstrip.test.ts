import { test } from "bun:test"
import { getTSlotCoverStripDimensions } from "@tscircuit/modelprinter"
import { createTSlotCoverStripMesh } from "../../lib/models/tslotcoverstrip"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("tslotcoverstrip standard labeled four-view visual snapshot", async () => {
  const props = {
    length: 40,
    width: 8,
    thickness: 1,
    stemWidth: 5.8,
    stemHeight: 2,
    barbWidth: 6.2,
    barbHeight: 0.5,
    tee: true,
  } as const
  const d = getTSlotCoverStripDimensions(props)
  const target = d.min.map((value, axis) => (value + d.max[axis]!) / 2) as [
    number,
    number,
    number,
  ]
  const span = Math.max(...d.size) * 1.65
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  const png = await renderModelSnapshot({
    mesh: createTSlotCoverStripMesh(props),
    title: "TSlotCoverStrip",
    modelString:
      "tslotcoverstrip_l40mm_w8mm_t1mm_stemw5.8mm_stemh2mm_barbw6.2mm_profile(tee)",
    footer: "Cover underside Y=0; lower bead retains the groove mouth",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Complete fitting geometry",
        eye: eye(1, -1, 1),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "Looking down +Z",
        eye: eye(0, 0, 2),
        target,
        span: Math.max(d.size[0], d.size[1]) * 1.7,
      },
      {
        name: "FRONT",
        detail: "Looking along +Y",
        eye: eye(0, -2, 0),
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "Looking along -X",
        eye: eye(2, 0, 0),
        target,
        span,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
