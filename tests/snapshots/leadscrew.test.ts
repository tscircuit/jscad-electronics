import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createLeadScrewMesh } from "../../lib/models/leadscrew"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { leadScrewExample } from "../fixtures/leadscrew-cases"
test("leadscrew full-string four-view geometry", async () => {
  const modelString = leadScrewExample,
    model = mp.string(modelString).json()
  if (model.fn !== "leadscrew") throw new Error("Wrong model")
  const { fn, ...props } = model
  const image = await renderModelSnapshot({
    mesh: createLeadScrewMesh(props, {
      radialSegments: 48,
      segmentsPerPitch: 12,
    }),
    title: "TR8 x 8 (P2) / FOUR-START LEAD SCREW",
    modelString,

    views: [
      {
        name: "ISOMETRIC",
        detail: "REAL TRAPEZOIDAL HELIX",
        eye: [80, -120, 95],
        target: [0, 0, 50],
        span: 125,
      },
      {
        name: "TOP",
        detail: "AXIAL THREAD-END PROFILE",
        eye: [0, 0, 200],
        target: [0, 0, 100],
        span: 12,
      },
      {
        name: "FRONT",
        detail: "100 mm BETWEEN END PLANES",
        eye: [0, -200, 50],
        target: [0, 0, 50],
        span: 125,
      },
      {
        name: "SIDE",
        detail: "PITCH 2 mm / DISTINCT LEAD",
        eye: [200, 0, 50],
        target: [0, 0, 50],
        span: 125,
      },
    ],
    footer: "POPPYGL / FOUR VIEWS / DIMENSIONS IN mm / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
