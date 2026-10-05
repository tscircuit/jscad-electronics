import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createClampingShaftCollarMesh } from "../../lib/ClampingShaftCollar"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("clampingshaftcollar exact roadmap string - four views", async () => {
  const modelString =
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4"
  const model = mp.string(modelString).json()
  if (model.fn !== "clampingshaftcollar") throw new Error("Wrong family")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createClampingShaftCollarMesh(props),
      title: "CLAMPINGSHAFTCOLLAR",
      modelString,
      views: [
        {
          name: "TOP",
          detail: "OPEN SHAFT BORE",
          eye: [0, 0, 44.5],
          target: [0, 0, 4.5],
          span: 26,
        },
        {
          name: "FRONT",
          detail: "CLEARANCE HALF AND RADIAL SLIT",
          eye: [0, -40, 4.5],
          target: [0, 0, 4.5],
          span: 28,
        },
        {
          name: "RIGHT",
          detail: "THREADED CLAMP ARM",
          eye: [0, 40, 4.5],
          target: [0, 0, 4.5],
          span: 28,
        },
        {
          name: "ISOMETRIC",
          detail: "BODY, BORE AND MOUNTING INTERFACES",
          eye: [35, 30, 39.5],
          target: [0, 0, 4.5],
          span: 30,
        },
      ],
      footer:
        "NOMINAL MILLIMETERS | REAL FEMALE THREAD CUTS | DATUM AT LOWER FACE Z=0",
    }),
    import.meta.path,
  )
})
