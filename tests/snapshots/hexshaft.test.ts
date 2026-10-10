import { test } from "bun:test"
import { getHexShaftDimensions } from "@tscircuit/modelprinter"
import { createHexShaftMesh } from "../../lib/models/hexshaft"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("hexshaft standard labeled four-view visual snapshot", async () => {
  const props = {
    acrossFlats: 12,
    length: 60,
    endChamfer: 1,
    regularHex: true,
  } as const
  const d = getHexShaftDimensions(props)
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
    mesh: createHexShaftMesh(props),
    title: "HexShaft",
    modelString: "hexshaft_af12mm_l60mm_profile(regularhex)_endchamfer1mm",
    footer: "Shaft axis +Z; bottom face Z=0; both ends chamfered",
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
