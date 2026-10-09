import { test } from "bun:test"
import { mp, getFemaleStandoffDimensions } from "@tscircuit/modelprinter"
import { createFemaleStandoffMesh } from "../../lib/models/femalestandoff"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("female standoff four-view labeled snapshot", async () => {
  const modelString = "femalestandoff_m3_af5.5mm_l10mm_hex_threadedthrough"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "femalestandoff")
    throw new Error("Expected female standoff")
  const { fn, ...props } = definition
  const dimensions = getFemaleStandoffDimensions(props)
  const target = [0, 0, dimensions.length / 2] as const
  const image = await renderModelSnapshot({
    mesh: createFemaleStandoffMesh(props),
    title: "M3 / FEMALE HEX STANDOFF",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "THREADED THROUGH BORE / TWO LEAD-IN CHAMFERS",
        eye: [18, -26, 24],
        target,
        span: 17,
      },
      {
        name: "TOP",
        detail: "5.5 mm ACROSS FLATS / M3 INTERNAL THREAD",
        eye: [0, 0, 30],
        target,
        span: 10,
      },
      {
        name: "FRONT",
        detail: "10 mm BODY LENGTH / MOUNTING FACE AT Z=0",
        eye: [0, -30, 5],
        target,
        span: 17,
      },
      {
        name: "SIDE",
        detail: "HEX BODY / 0.2 mm END CHAMFERS",
        eye: [30, 0, 5],
        target,
        span: 17,
      },
    ],
    footer:
      "FOUR VIEWS / DIMENSIONS IN mm / GENERIC VISUAL ENVELOPE / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
