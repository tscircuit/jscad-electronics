import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createNylonLockNutMeshes } from "../../lib/models/nylonlocknut"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("nylonlocknut full model string - four views with separate nylon material", async () => {
  const modelString = "nylonlocknut_m6"
  const model = mp.string(modelString).json()
  if (model.fn !== "nylonlocknut") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const parts = createNylonLockNutMeshes(props, {
    radialSegments: 48,
    segmentsPerPitch: 16,
  })
  const image = await renderModelSnapshot({
    mesh: parts.metal,
    additionalMeshes: [{ mesh: parts.insert, color: [0.14, 0.42, 0.82, 1] }],
    title: "M6 / ISO NYLON LOCK NUT",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "BLUE NYLON INSERT / STEEL COLLAR",
        eye: [15, -22, 18],
        target: [0, 0, 4],
        span: 16,
      },
      {
        name: "TOP",
        detail: "LOCKING INSERT / OPEN AXIAL BORE",
        eye: [0, 0, 30],
        target: [0, 0, 4],
        span: 16,
      },
      {
        name: "FRONT",
        detail: "8 mm TOTAL / 10 mm ACROSS FLATS",
        eye: [0, -30, 4],
        target: [0, 0, 4],
        span: 16,
      },
      {
        name: "SIDE",
        detail: "METAL BODY / RAISED COLLAR",
        eye: [30, 0, 4],
        target: [0, 0, 4],
        span: 16,
      },
    ],
    footer:
      "POPPYGL / FOUR VIEWS / DIMENSIONS IN mm / NOMINAL MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
