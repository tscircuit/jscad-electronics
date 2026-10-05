import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createButtonScrewMesh } from "../../lib/ButtonScrew"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("buttonscrew roadmap example - four-view PoppyGL snapshot", async () => {
  const modelString =
    "buttonscrew_standard(iso7380-1)_m3_l10mm_drive(hexsocket)"
  const model = mp.string(modelString).json()
  if (model.fn !== "buttonscrew") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const image = await renderModelSnapshot({
    mesh: createButtonScrewMesh(props, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    }),
    title: "M3 x 10 mm / ISO BUTTON HEAD SOCKET SCREW",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "MOUNTING AND THREAD GEOMETRY",
        eye: [15, -22, 18],
        target: [0, 0, -4.2],
        span: 15,
      },
      {
        name: "TOP",
        detail: "BLIND HEX SOCKET",
        eye: [0, 0, 25],
        target: [0, 0, 1.65],
        span: 8,
      },
      {
        name: "FRONT",
        detail: "10 mm UNDER-HEAD LENGTH",
        eye: [0, -30, -4.2],
        target: [0, 0, -4.2],
        span: 15,
      },
      {
        name: "UNDERSIDE",
        detail: "BEARING FACE AND TIP CHAMFER",
        eye: [-18, -23, -20],
        target: [0, 0, -4.2],
        span: 15,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
