import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createTSlotInsideCornerMesh } from "../../lib/models/tslotinsidecorner"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("T-slot inside corner complete roadmap string - four views", async () => {
  const modelString =
    "tslotinsidecorner_w20mm_leg40mm_t4mm_angle90deg_holes2_hole5mm_offset20mm_bendr1mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "tslotinsidecorner") throw new Error("Wrong model family")
  const { fn, ...props } = model
  const png = await renderModelSnapshot({
    mesh: createTSlotInsideCornerMesh(props),
    title: "T-SLOT INSIDE CORNER / TWO DRILLED LEGS",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "EQUAL 40 mm LEGS / 4 mm THICKNESS",
        eye: [70, -65, 65],
        target: [16, 0, 16],
        span: 75,
        far: 400,
      },
      {
        name: "TOP",
        detail: "BASE THROUGH HOLE / CENTERED WIDTH",
        eye: [20, 0, 85],
        target: [20, 0, 0],
        span: 65,
        far: 400,
      },
      {
        name: "FRONT",
        detail: "1 mm INSIDE BEND / 5 mm OUTSIDE BEND",
        eye: [18, -75, 18],
        target: [18, 0, 18],
        span: 65,
        far: 400,
      },
      {
        name: "RIGHT",
        detail: "UPRIGHT THROUGH HOLE / 20 mm OFFSET",
        eye: [80, 0, 20],
        target: [0, 0, 20],
        span: 65,
        far: 400,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / mm / NO INTERNAL BEND SEAM CAPS",
  })
  await expectPngSnapshot(png, import.meta.path)
})
