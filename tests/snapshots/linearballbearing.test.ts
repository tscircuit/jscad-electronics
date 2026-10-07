import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createLinearBallBearingMesh } from "../../lib/models/linearballbearing"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("linearballbearing full canonical string in standard four views", async () => {
  const modelString = "linearballbearing_bore8mm_od15mm_l24mm_seals(both)"
  const model = mp.string(modelString).json()
  if (model.fn !== "linearballbearing")
    throw new Error("Expected linearballbearing")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createLinearBallBearingMesh(props),
      title: "GENERIC LINEAR BALL BEARING / NOMINAL RECIRCULATION",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [32, -42, 42],
          target: [0, 0, 12],
          span: 38,
        },
        {
          name: "TOP",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [0, 0, 68],
          target: [0, 0, 12],
          span: 26,
        },
        {
          name: "FRONT",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [0, -58, 12],
          target: [0, 0, 12],
          span: 38,
        },
        {
          name: "SIDE",
          detail: "DIMENSIONS AND MOUNTING DATUM IN mm",
          eye: [58, 0, 12],
          target: [0, 0, 12],
          span: 38,
        },
      ],
      footer:
        "POPPYGL / NOMINAL ASSEMBLY / UNTOLERANCED mm / REAL THROUGH BORE / NO MANUFACTURER INTERNAL CLAIM",
    }),
    import.meta.path,
  )
})
