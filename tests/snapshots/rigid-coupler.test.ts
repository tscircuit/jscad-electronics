import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createRigidCouplerMesh } from "../../lib/models/rigidcoupler"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("rigidcoupler exact roadmap string - four views", async () => {
  const modelString =
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4"
  const model = mp.string(modelString).json()
  if (model.fn !== "rigidcoupler") throw new Error("Wrong family")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createRigidCouplerMesh(props),
      title: "RIGIDCOUPLER",
      modelString,
      views: [
        {
          name: "TOP",
          detail: "OPEN SHAFT BORE",
          eye: [0, 0, 52.5],
          target: [0, 0, 12.5],
          span: 28,
        },
        {
          name: "FRONT",
          detail: "RADIAL THREADED MOUNTING HOLES",
          eye: [40, 0, 12.5],
          target: [0, 0, 12.5],
          span: 35,
        },
        {
          name: "RIGHT",
          detail: "SECOND HOLE AT EACH SHAFT END",
          eye: [0, 40, 12.5],
          target: [0, 0, 12.5],
          span: 35,
        },
        {
          name: "ISOMETRIC",
          detail: "BODY, BORE AND MOUNTING INTERFACES",
          eye: [35, 30, 47.5],
          target: [0, 0, 12.5],
          span: 37,
        },
      ],
      footer:
        "NOMINAL MILLIMETERS | REAL FEMALE THREAD CUTS | DATUM AT LOWER FACE Z=0",
    }),
    import.meta.path,
  )
})
