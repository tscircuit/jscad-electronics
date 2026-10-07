import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createLinearBearingBlockMesh } from "../../lib/models/linearbearingblock"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("linearbearingblock full canonical string in standard four views", async () => {
  const modelString =
    "linearbearingblock_bore8mm_bearingod15mm_w34mm_l24mm_h24mm_mount(clearance)_hole4.5mm_pitchx24mm_pitchy16mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "linearbearingblock")
    throw new Error("Expected linearbearingblock")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createLinearBearingBlockMesh(props),
      title: "GENERIC LINEAR BEARING BLOCK / FOUR MOUNTING HOLES",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [52, -65, 55],
          target: [0, 0, 12],
          span: 60,
        },
        {
          name: "TOP",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [0, 0, 90],
          target: [0, 0, 12],
          span: 44,
        },
        {
          name: "FRONT",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [0, -90, 12],
          target: [0, 0, 12],
          span: 44,
        },
        {
          name: "SIDE",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [90, 0, 12],
          target: [0, 0, 12],
          span: 44,
        },
      ],
      footer:
        "POPPYGL / NOMINAL ASSEMBLY / UNTOLERANCED mm / REAL THROUGH BORE / NO MANUFACTURER INTERNAL CLAIM",
    }),
    import.meta.path,
  )
})
