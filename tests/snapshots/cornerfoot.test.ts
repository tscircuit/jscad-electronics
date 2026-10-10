import { test } from "bun:test"
import { createCornerFootMesh } from "../../lib/models/cornerfoot"
import {
  cornerFootProps,
  cornerFootSource,
} from "../fixtures/cornerfoot-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("cornerfoot standard four-view visual snapshot", async () => {
  const target = [0, 0, 6.0] as const
  const png = await renderModelSnapshot({
    mesh: createCornerFootMesh(cornerFootProps),
    title: "CornerFoot",
    modelString: cornerFootSource,
    color: [0.27, 0.32, 0.38, 1],
    footer: "Nominal custom geometry; dimensions in millimeters",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Installation geometry",
        eye: [100, -140, 110],
        target,
        span: 32.5,
      },
      {
        name: "TOP",
        detail: "View along -Z",
        eye: [0, 0, 150],
        target,
        span: 32.5,
      },
      {
        name: "FRONT",
        detail: "View from -Y",
        eye: [0, -150, 6.0],
        target,
        span: 32.5,
      },
      {
        name: "SIDE",
        detail: "View from +X",
        eye: [150, 0, 6.0],
        target,
        span: 32.5,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
