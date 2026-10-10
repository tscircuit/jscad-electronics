import { test } from "bun:test"
import { getHatSectionDimensions } from "@tscircuit/modelprinter"
import { createHatSectionMesh } from "../../lib/models/hatsection"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("hatsection 10: standard labeled four-view visual snapshot", async () => {
  const props = {
    crownWidth: 40,
    height: 20,
    lipWidth: 10,
    thickness: 2,
    bendRadius: 2,
    length: 80,
  } as const
  const dims = getHatSectionDimensions(props)
  const target: [number, number, number] = [0, 0, dims.topZ / 2]
  const span = Math.max(...dims.size) * 1.5
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createHatSectionMesh(props),
      title: "HatSection",
      modelString: "hatsection_crownw40mm_h20mm_lip10mm_t2mm_bendr2mm_l80mm",
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
