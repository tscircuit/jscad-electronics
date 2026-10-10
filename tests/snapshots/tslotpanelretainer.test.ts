import { test } from "bun:test"
import { getTSlotPanelRetainerDimensions } from "@tscircuit/modelprinter"
import { createTSlotPanelRetainerMesh } from "../../lib/models/tslotpanelretainer"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("tslotpanelretainer 10: standard labeled four-view visual snapshot", async () => {
  const props = {
    width: 20,
    height: 25,
    depth: 12,
    thickness: 3,
    panelThickness: 3,
    offset: 5,
    holeDiameter: 5,
  } as const
  const dims = getTSlotPanelRetainerDimensions(props)
  const target: [number, number, number] = [0, 6.0, dims.topZ / 2]
  const span = Math.max(...dims.size) * 1.5
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createTSlotPanelRetainerMesh(props),
      title: "TSlotPanelRetainer",
      modelString:
        "tslotpanelretainer_w20mm_h25mm_d12mm_t3mm_panel3mm_offset5mm_hole5mm",
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
