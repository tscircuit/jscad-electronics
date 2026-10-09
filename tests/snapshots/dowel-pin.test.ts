import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createDowelPinMesh } from "../../lib/models/dowelpin"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("dowel pin proposal has a labeled standard four-view snapshot", async () => {
  const modelString = "dowelpin_d3mm_l10mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "dowelpin") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const image = await renderModelSnapshot({
    mesh: createDowelPinMesh(props, { radialSegments: 64 }),
    title: "3 x 10 mm / ISO 8734 DOWEL PIN",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "CYLINDRICAL BODY / TWO CONICAL END LEADS",
        eye: [13, -20, 20],
        target: [0, 0, 5],
        span: 14,
      },
      {
        name: "TOP",
        detail: "FLAT END DISK / NOMINAL DIAMETER 3 mm",
        eye: [0, 0, 30],
        target: [0, 0, 10],
        span: 5,
      },
      {
        name: "FRONT",
        detail: "10 mm OVERALL / 0.5 mm AXIAL END LEADS",
        eye: [0, -30, 5],
        target: [0, 0, 5],
        span: 14,
      },
      {
        name: "SIDE",
        detail: "15 DEGREE LEADS / END PLANES Z=0 AND Z=10",
        eye: [30, 0, 5],
        target: [0, 0, 5],
        span: 14,
      },
    ],
    footer: "POPPYGL / DIMENSIONS IN mm / NOMINAL FLAT-ENDED VISUAL CONVENTION",
  })
  await expectPngSnapshot(image, import.meta.path)
})
