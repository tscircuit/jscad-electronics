import { test } from "bun:test"
import { getCableClampDimensions } from "@tscircuit/modelprinter"
import { createCableClampMesh } from "../../lib/models/cableclamp/geometry"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("cableclamp standard four-view visual snapshot", async () => {
  const p = {
    innerDiameter: 10,
    bandWidth: 12,
    thickness: 1,
    tabLength: 12,
    holeDiameter: 4,
  }
  const d = getCableClampDimensions(p),
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
    mesh: createCableClampMesh(p),
    title: "CableClamp",
    modelString: "cableclamp_id10mm_bandw12mm_t1mm_tab12mm_hole4mm",
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
        span: Math.max(d.size[1], d.size[2]) * 1.6,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
