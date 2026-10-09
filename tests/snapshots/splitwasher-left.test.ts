import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createSplitWasherMesh } from "../../lib/models/splitwasher"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
test("split washer left hand in four views", async () => {
  const modelString =
    "splitwasher_id6.1mm_od11.8mm_t1.6mm_rise1.6mm_gapangle10deg_rectangular_lefthanded"
  const p = mp.string(modelString).json()
  if (p.fn !== "splitwasher") throw new Error("Expected split washer")
  const { fn, ...props } = p
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createSplitWasherMesh(props),
      title: "SPLIT WASHER / LEFT HAND / FREE STATE",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "MIRRORED HAND / OPEN ANGULAR GAP",
          eye: [20, -26, 22],
          target: [0, 0, 1.6],
          span: 15,
        },
        {
          name: "TOP",
          detail: "6.1mm BORE / 11.8mm OUTSIDE / 10deg GAP",
          eye: [0, 0, 40],
          target: [0, 0, 1.6],
          span: 15,
        },
        {
          name: "FRONT",
          detail: "1.6mm THICKNESS + 1.6mm RISE",
          eye: [0, -40, 1.6],
          target: [0, 0, 1.6],
          span: 15,
        },
        {
          name: "SIDE",
          detail: "TOTAL HEIGHT 3.2mm / DATUM Z=0",
          eye: [40, 0, 1.6],
          target: [0, 0, 1.6],
          span: 15,
        },
      ],
      footer:
        "POPPYGL / DIMENSIONS IN mm / CUSTOM FREE GEOMETRY / NO LOAD MODEL",
    }),
    import.meta.path,
  )
})
