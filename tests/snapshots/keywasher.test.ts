import { test } from "bun:test"
import { createKeyWasherMesh } from "../../lib/models/keywasher"
import { keyWasherProps, keyWasherSource } from "../fixtures/keywasher-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("keywasher standard four-view visual snapshot", async () => {
  const target = [0, 0, 0.5] as const
  const png = await renderModelSnapshot({
    mesh: createKeyWasherMesh(keyWasherProps),
    title: "KeyWasher",
    modelString: keyWasherSource,
    color: [0.27, 0.32, 0.38, 1],
    footer: "Nominal custom geometry; dimensions in millimeters",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Installation geometry",
        eye: [100, -140, 110],
        target,
        span: 26.0,
      },
      {
        name: "TOP",
        detail: "View along -Z",
        eye: [0, 0, 150],
        target,
        span: 26.0,
      },
      {
        name: "FRONT",
        detail: "View from -Y",
        eye: [0, -150, 0.5],
        target,
        span: 26.0,
      },
      {
        name: "SIDE",
        detail: "View from +X",
        eye: [150, 0, 0.5],
        target,
        span: 26.0,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
