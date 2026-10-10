import { test } from "bun:test"
import { createSplitGrommetMesh } from "../../lib/models/splitgrommet"
import {
  splitGrommetProps,
  splitGrommetSource,
} from "../fixtures/splitgrommet-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("splitgrommet standard four-view visual snapshot", async () => {
  const target = [0, 0, 0] as const
  const png = await renderModelSnapshot({
    mesh: createSplitGrommetMesh(splitGrommetProps),
    title: "SplitGrommet",
    modelString: splitGrommetSource,
    color: [0.27, 0.32, 0.38, 1],
    footer: "Nominal custom geometry; dimensions in millimeters",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Installation geometry",
        eye: [100, -140, 110],
        target,
        span: 39.0,
      },
      {
        name: "TOP",
        detail: "View along -Z",
        eye: [0, 0, 150],
        target,
        span: 39.0,
      },
      {
        name: "FRONT",
        detail: "View from -Y",
        eye: [0, -150, 0],
        target,
        span: 39.0,
      },
      {
        name: "SIDE",
        detail: "View from +X",
        eye: [150, 0, 0],
        target,
        span: 39.0,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
