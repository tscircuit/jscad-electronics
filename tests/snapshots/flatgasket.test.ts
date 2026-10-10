import { test } from "bun:test"
import { createFlatGasketMesh } from "../../lib/models/flatgasket"
import {
  flatGasketProps,
  flatGasketSource,
} from "../fixtures/flatgasket-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("flatgasket standard four-view visual snapshot", async () => {
  const target = [0, 0, 1.0] as const
  const png = await renderModelSnapshot({
    mesh: createFlatGasketMesh(flatGasketProps),
    title: "FlatGasket",
    modelString: flatGasketSource,
    color: [0.27, 0.32, 0.38, 1],
    footer: "Nominal custom geometry; dimensions in millimeters",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Installation geometry",
        eye: [100, -140, 110],
        target,
        span: 45.5,
      },
      {
        name: "TOP",
        detail: "View along -Z",
        eye: [0, 0, 150],
        target,
        span: 45.5,
      },
      {
        name: "FRONT",
        detail: "View from -Y",
        eye: [0, -150, 1.0],
        target,
        span: 45.5,
      },
      {
        name: "SIDE",
        detail: "View from +X",
        eye: [150, 0, 1.0],
        target,
        span: 45.5,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
