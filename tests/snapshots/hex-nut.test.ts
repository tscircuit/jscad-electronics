import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createHexNutMesh } from "../../lib/models/hexnut"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("hexnut roadmap example - four-view PoppyGL snapshot", async () => {
  const modelString = "hexnut_standard(iso4032)_m6"
  const model = mp.string(modelString).json()
  if (model.fn !== "hexnut") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const image = await renderModelSnapshot({
    mesh: createHexNutMesh(props, { radialSegments: 48, segmentsPerPitch: 16 }),
    title: "M6 / ISO REGULAR HEX NUT",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "MOUNTING AND THREAD GEOMETRY",
        eye: [15, -22, 18],
        target: [0, 0, 2.6],
        span: 14,
      },
      {
        name: "TOP",
        detail: "CHAMFERED THROUGH THREAD",
        eye: [0, 0, 25],
        target: [0, 0, 2.6],
        span: 14,
      },
      {
        name: "FRONT",
        detail: "5.2 mm THICKNESS / 10 mm ACROSS FLATS",
        eye: [0, -30, 2.6],
        target: [0, 0, 2.6],
        span: 14,
      },
      {
        name: "UNDERSIDE",
        detail: "SECOND BORE ENTRANCE",
        eye: [-18, -23, -15],
        target: [0, 0, 2.6],
        span: 14,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
