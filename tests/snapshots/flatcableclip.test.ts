import { annotateSnapshot } from "../fixtures/flatcableclip-snapshot-sheet"
import { test } from "bun:test"
import { getFlatCableClipDimensions } from "@tscircuit/modelprinter"
import { createFlatCableClipMesh } from "../../lib/models/flatcableclip"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { props, modelString } from "../fixtures/flatcableclip-case"
test("flatcableclip standard labeled four-view snapshot", async () => {
  const bounds = getFlatCableClipDimensions(props).bounds
  const span =
    Math.max(...bounds[1].map((value, axis) => value - bounds[0][axis]!)) * 1.9
  const target: [number, number, number] = [0, 1, 2].map(
    (axis) => (bounds[0][axis]! + bounds[1][axis]!) / 2,
  ) as [number, number, number]
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  const png = await renderModelSnapshot({
    mesh: createFlatCableClipMesh(props),
    title: "FlatCableClip",
    modelString,
    footer: "Custom nominal fitting geometry in mm; mounting datum Z=0",
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
        detail: "Looking down Z",
        eye: eye(0, 0, 2),
        target,
        span:
          Math.max(bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]) *
          1.6,
      },
      {
        name: "FRONT",
        detail: "Looking along Y",
        eye: eye(0, -2, 0),
        target,
        span:
          Math.max(bounds[1][0] - bounds[0][0], bounds[1][2] - bounds[0][2]) *
          1.6,
      },
      {
        name: "SIDE",
        detail: "Looking along X",
        eye: eye(2, 0, 0),
        target,
        span:
          Math.max(bounds[1][1] - bounds[0][1], bounds[1][2] - bounds[0][2]) *
          1.6,
      },
    ],
  })
  await expectPngSnapshot(
    annotateSnapshot(png, "FlatCableClip", modelString),
    import.meta.path,
  )
})
