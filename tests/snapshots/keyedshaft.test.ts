import { test } from "bun:test"
import { getKeyedShaftDimensions } from "@tscircuit/modelprinter"
import { createKeyedShaftMesh } from "../../lib/models/keyedshaft"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("keyedshaft standard labeled four-view visual snapshot", async () => {
  const props = {
    diameter: 20,
    length: 80,
    keyWidth: 6,
    keyDepth: 3,
    keyLength: 55,
    endChamfer: 1,
  } as const
  const d = getKeyedShaftDimensions(props)
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
    mesh: createKeyedShaftMesh(props),
    title: "KeyedShaft",
    modelString:
      "keyedshaft_d20mm_l80mm_keyw6mm_keydepth3mm_keyl55mm_endchamfer1mm",
    footer: "Shaft axis +Z; bottom face Z=0; both ends chamfered",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Complete fitting geometry",
        eye: eye(1, 1, 1),
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
        detail: "Looking along -Y at keyway",
        eye: eye(0, 2, 0),
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
