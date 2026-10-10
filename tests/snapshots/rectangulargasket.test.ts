import { test } from "bun:test"
import { createRectangularGasketMesh } from "../../lib/models/rectangulargasket"
import {
  rectangularGasketProps,
  rectangularGasketSource,
} from "../fixtures/rectangulargasket-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("rectangulargasket standard four-view visual snapshot", async () => {
  const target = [0, 0, 1.0] as const
  const png = await renderModelSnapshot({
    mesh: createRectangularGasketMesh(rectangularGasketProps),
    title: "RectangularGasket",
    modelString: rectangularGasketSource,
    color: [0.27, 0.32, 0.38, 1],
    footer: "Nominal custom geometry; dimensions in millimeters",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Installation geometry",
        eye: [100, -140, 110],
        target,
        span: 104.0,
      },
      {
        name: "TOP",
        detail: "View along -Z",
        eye: [0, 0, 150],
        target,
        span: 104.0,
      },
      {
        name: "FRONT",
        detail: "View from -Y",
        eye: [0, -150, 1.0],
        target,
        span: 104.0,
      },
      {
        name: "SIDE",
        detail: "View from +X",
        eye: [150, 0, 1.0],
        target,
        span: 104.0,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
