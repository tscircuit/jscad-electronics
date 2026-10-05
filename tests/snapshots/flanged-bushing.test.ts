import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createFlangedBushingMesh } from "../../lib/FlangedBushing"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("flanged bushing - full roadmap model in four views", async () => {
  const modelString =
    "flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm_style(plainclosed)"
  const model = mp.string(modelString).json()
  if (model.fn !== "flangedbushing") throw new Error("Expected flanged bushing")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createFlangedBushingMesh(props),
      title: "FLANGED BUSHING / INTEGRAL FLANGE AND THROUGH BORE",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "ONE PIECE / 13mm PROJECTING SLEEVE",
          eye: [28, -35, 38],
          target: [0, 0, 7.5],
          span: 30,
        },
        {
          name: "TOP",
          detail: "8mm BORE / 12mm SLEEVE / 18mm FLANGE",
          eye: [0, 0, 50],
          target: [0, 0, 7.5],
          span: 23,
        },
        {
          name: "FRONT",
          detail: "15mm TOTAL LENGTH / 2mm FLANGE THICKNESS",
          eye: [0, -45, 7.5],
          target: [0, 0, 7.5],
          span: 30,
        },
        {
          name: "UNDERSIDE",
          detail: "FLANGE FACE AT Z=0 / OPEN BORE EXIT",
          eye: [-28, -35, -20],
          target: [0, 0, 7.5],
          span: 30,
        },
      ],
      footer:
        "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / LENGTH INCLUDES FLANGE",
    }),
    import.meta.path,
  )
})
