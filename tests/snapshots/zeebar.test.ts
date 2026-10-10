import { test } from "bun:test"
import { getZeeBarDimensions } from "@tscircuit/modelprinter"
import { createZeeBarMesh } from "../../lib/models/zeebar"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("zeebar 10: standard labeled four-view visual snapshot", async () => {
  const props = {
    height: 30,
    upperWidth: 20,
    lowerWidth: 20,
    thickness: 2,
    bendRadius: 2,
    length: 80,
  } as const
  const dims = getZeeBarDimensions(props)
  const target: [number, number, number] = [0, 0, dims.topZ / 2]
  const span = Math.max(...dims.size) * 1.5
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createZeeBarMesh(props),
      title: "ZeeBar",
      modelString: "zeebar_h30mm_upperw20mm_lowerw20mm_t2mm_bendr2mm_l80mm",
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
