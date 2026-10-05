import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createTSlotGussetMesh } from "../../lib/models/tslotgusset"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("T-slot gusset complete roadmap string - four views", async () => {
  const modelString =
    "tslotgusset_w40mm_h40mm_t4mm_shape(righttriangle)_slots2_slot(5mm,12mm)_centers(12mm,28mm)"
  const model = mp.string(modelString).json()
  if (model.fn !== "tslotgusset") throw new Error("Wrong model family")
  const { fn, ...props } = model
  const png = await renderModelSnapshot({
    mesh: createTSlotGussetMesh(props),
    title: "T-SLOT GUSSET / TRIANGLE WITH TWO FIXING SLOTS",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "RIGHT TRIANGLE / TWO PERPENDICULAR SLOTS",
        eye: [65, -65, 85],
        target: [15, 15, 2],
        span: 55,
        far: 400,
      },
      {
        name: "TOP",
        detail: "5 x 12 mm CAPSULES / 1 mm EDGE LIGAMENT",
        eye: [20, 20, 85],
        target: [20, 20, 2],
        span: 50,
        far: 400,
      },
      {
        name: "FRONT",
        detail: "4 mm THICKNESS / FULL THROUGH CUTS",
        eye: [20, -65, 2],
        target: [20, 15, 2],
        span: 50,
        far: 400,
      },
      {
        name: "UNDERSIDE",
        detail: "OPEN SLOT EXITS / CONTINUOUS PLATE",
        eye: [20, -20, -60],
        target: [15, 15, 2],
        span: 65,
        far: 400,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / mm / CENTERS ARE ALONG-EDGE DISTANCES",
  })
  await expectPngSnapshot(png, import.meta.path)
})
