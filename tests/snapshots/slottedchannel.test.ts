import { test } from "bun:test"
import { getSlottedChannelDimensions } from "@tscircuit/modelprinter"
import { createSlottedChannelMesh } from "../../lib/models/slottedchannel"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("slottedchannel 10: standard labeled four-view visual snapshot", async () => {
  const props = {
    width: 40,
    height: 20,
    thickness: 3,
    innerRadius: 3,
    length: 80,
    slotCount: 3,
    slotWidth: 6,
    slotLength: 12,
    pitch: 25,
    endOffset: 15,
  } as const
  const dims = getSlottedChannelDimensions(props)
  const target: [number, number, number] = [0, 0, dims.topZ / 2]
  const span = Math.max(...dims.size) * 1.5
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createSlottedChannelMesh(props),
      title: "SlottedChannel",
      modelString:
        "slottedchannel_w40mm_h20mm_t3mm_innerr3mm_l80mm_slots3_slotw6mm_slotl12mm_pitch25mm_end15mm",
      footer: "Custom dimensions in mm; bottom datum Z=0; square cut ends",
      views: [
        {
          name: "ISOMETRIC",
          detail: "Complete nominal geometry",
          eye: eye(1, -1, 1),
          target,
          span,
        },
        {
          name: "TOP",
          detail: "Looking down +Z",
          eye: eye(0, 0, 2),
          target,
          span: Math.max(dims.size[0], dims.size[1]) * 1.5,
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
    }),
    import.meta.path,
  )
})
