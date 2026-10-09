import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createSpacerMesh } from "../../lib/models/spacer"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("round spacer full model string in four standard views", async () => {
  const modelString = "spacer_id3.2mm_od6mm_l10mm_round_chamfer0.3mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "spacer") throw new Error("Expected spacer")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createSpacerMesh(props),
      title: "ROUND SPACER / THROUGH BORE",
      modelString,
      color: [0.63, 0.52, 0.31, 1],
      views: [
        {
          name: "ISOMETRIC",
          detail: "FOUR 0.3mm RIM CHAMFERS",
          eye: [15, -20, 24],
          target: [0, 0, 5],
          span: 16,
        },
        {
          name: "TOP",
          detail: "3.2mm BORE / 6mm OUTSIDE",
          eye: [0, 0, 30],
          target: [0, 0, 5],
          span: 9,
        },
        {
          name: "FRONT",
          detail: "10mm OVERALL LENGTH",
          eye: [0, -30, 5],
          target: [0, 0, 5],
          span: 15,
        },
        {
          name: "SIDE",
          detail: "LOWER MOUNTING FACE Z=0",
          eye: [30, 0, 5],
          target: [0, 0, 5],
          span: 15,
        },
      ],
      footer:
        "POPPYGL / DIMENSIONS IN mm / UNTHREADED SPACER / DATUM Z=0 AT LOWER END",
    }),
    import.meta.path,
  )
})
