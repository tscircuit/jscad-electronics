import { test } from "bun:test"
import { getPerforatedAngleDimensions } from "@tscircuit/modelprinter"
import { createPerforatedAngleMesh } from "../../lib/models/perforatedangle"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("perforatedangle 10: standard labeled four-view visual snapshot", async () => {
  const props = {
    width: 25,
    height: 25,
    thickness: 3,
    length: 80,
    innerRadius: 3,
    holeCount: 3,
    holeDiameter: 6,
    pitch: 25,
    endOffset: 15,
    legOffset: 12.5,
  } as const
  const dims = getPerforatedAngleDimensions(props)
  const target: [number, number, number] = [0, 0, dims.topZ / 2]
  const span = Math.max(...dims.size) * 1.5
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createPerforatedAngleMesh(props),
      title: "PerforatedAngle",
      modelString:
        "perforatedangle_w25mm_h25mm_t3mm_l80mm_innerr3mm_holes3_hole6mm_pitch25mm_end15mm_legoffset12.5mm",
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
