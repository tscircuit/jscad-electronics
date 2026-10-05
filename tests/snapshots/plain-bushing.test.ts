import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPlainBushingMesh } from "../../lib/models/plainbushing"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("plain bushing - full roadmap model in four views", async () => {
  const modelString =
    "plainbushing_id8mm_od12mm_l20mm_style(plainclosed)_edgechamfer0.5mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "plainbushing") throw new Error("Expected plain bushing")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createPlainBushingMesh(props),
      title: "PLAIN BUSHING / THROUGH BORE AND FOUR RIM CHAMFERS",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "CLOSED SLEEVE / 0.5mm RIM CHAMFERS",
          eye: [28, -35, 38],
          target: [0, 0, 10],
          span: 27,
        },
        {
          name: "TOP",
          detail: "8mm THROUGH BORE / CHAMFERED OPENING",
          eye: [0, 0, 50],
          target: [0, 0, 10],
          span: 16,
        },
        {
          name: "FRONT",
          detail: "20mm OVERALL LENGTH / 12mm OUTSIDE",
          eye: [0, -45, 10],
          target: [0, 0, 10],
          span: 27,
        },
        {
          name: "UNDERSIDE",
          detail: "OPEN BORE EXIT / LOWER RIM CHAMFERS",
          eye: [-28, -35, -20],
          target: [0, 0, 10],
          span: 27,
        },
      ],
      footer:
        "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / DATUM Z=0 AT LOWER END",
    }),
    import.meta.path,
  )
})
