import { test } from "bun:test"
import { getTSlotEndCapDimensions } from "@tscircuit/modelprinter"
import { createTSlotEndCapMesh } from "../../lib/models/tslotendcap"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("tslotendcap standard labeled four-view visual snapshot", async () => {
  const props = {
    width: 20,
    height: 20,
    thickness: 3,
    cornerRadius: 1,
    pinDiameter: 3.8,
    pinLength: 6,
    pinCount: 1,
    centered: true,
  } as const
  const d = getTSlotEndCapDimensions(props)
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
    mesh: createTSlotEndCapMesh(props),
    title: "TSlotEndCap",
    modelString:
      "tslotendcap_w20mm_h20mm_t3mm_corner1mm_pinod3.8mm_pinl6mm_pins1_centered",
    footer: "Profile attachment datum Z=0; friction pin extends downward",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Underside and centered friction pin",
        eye: eye(1, -1, -1),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "Looking down +Z",
        eye: eye(0, 0, 2),
        target,
        span,
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
