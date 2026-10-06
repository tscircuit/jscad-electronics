import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createShaftCollarMesh } from "../../lib/models/shaftcollar"
import { renderModelSnapshot } from "../fixtures/render-orthographic-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("shaftcollar exact roadmap string - four views", async () => {
  const modelString = "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4"
  const model = mp.string(modelString).json()
  if (model.fn !== "shaftcollar") throw new Error("Wrong family")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createShaftCollarMesh(props),
      title: "SHAFTCOLLAR",
      modelString,
      views: [
        {
          name: "TOP",
          detail: "OPEN SHAFT BORE",
          eye: [0, 0, 44.0],
          target: [0, 0, 4.0],
          span: 24,
        },
        {
          name: "FRONT",
          detail: "RADIAL THREADED MOUNTING HOLES",
          eye: [40, 0, 4.0],
          target: [0, 0, 4.0],
          span: 26,
        },
        {
          name: "RIGHT",
          detail: "NOMINAL ANNULAR BODY",
          eye: [0, 40, 4.0],
          target: [0, 0, 4.0],
          span: 26,
        },
        {
          name: "ISOMETRIC",
          detail: "BODY, BORE AND MOUNTING INTERFACES",
          eye: [35, 30, 39.0],
          target: [0, 0, 4.0],
          span: 28,
        },
      ],
      footer:
        "NOMINAL MILLIMETERS | REAL FEMALE THREAD CUTS | DATUM AT LOWER FACE Z=0",
    }),
    import.meta.path,
  )
})
