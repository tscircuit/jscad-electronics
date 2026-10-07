import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createLeadScrewNutMesh } from "../../lib/models/leadscrewnut"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { leadScrewNutExample } from "../fixtures/leadscrewnut-cases"
test("leadscrewnut full-string four-view geometry", async () => {
  const modelString = leadScrewNutExample,
    model = mp.string(modelString).json()
  if (model.fn !== "leadscrewnut") throw new Error("Wrong model")
  const { fn, ...props } = model
  const image = await renderModelSnapshot({
    mesh: createLeadScrewNutMesh(props, {
      radialSegments: 48,
      segmentsPerPitch: 12,
      holeSegments: 24,
    }),
    title: "TR8 / FLANGED LEAD SCREW NUT",
    modelString,
    color: [0.7, 0.59, 0.31, 1],
    views: [
      {
        name: "ISOMETRIC",
        detail: "THREADED BORE AND MOUNTING ENVELOPE",
        eye: [32, -45, 35],
        target: [0, 0, 7.5],
        span: 34,
      },
      {
        name: "TOP",
        detail: "FOUR AXIAL MOUNTING HOLES",
        eye: [0, 0, 600],
        target: [0, 0, 7.5],
        span: 30,
      },
      {
        name: "FRONT",
        detail: "Z=0 MOUNTING FACE / Z=15 TOP",
        eye: [0, -60, 7.5],
        target: [0, 0, 7.5],
        span: 30,
      },
      {
        name: "SIDE",
        detail: "THROUGH BORE / NOMINAL FIT CLEARANCE",
        eye: [60, 0, 7.5],
        target: [0, 0, 7.5],
        span: 30,
      },
    ],
    footer: "POPPYGL / FOUR VIEWS / DIMENSIONS IN mm / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
