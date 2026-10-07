import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createBallBearingMesh } from "../../lib/models/ballbearing"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("ballbearing-open full canonical string in standard four views", async () => {
  const modelString = "ballbearing_code608_closure(open)"
  const model = mp.string(modelString).json()
  if (model.fn !== "ballbearing") throw new Error("Expected ballbearing")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createBallBearingMesh(props),
      title: "DEEP-GROOVE RADIAL BALL BEARING / NOMINAL INTERNALS",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "NOMINAL OPEN ASSEMBLY",
          eye: [35, -45, 30],
          target: [0, 0, 3.5],
          span: 29,
        },
        {
          name: "TOP",
          detail: "NOMINAL OPEN ASSEMBLY",
          eye: [0, 0, 65],
          target: [0, 0, 3.5],
          span: 32,
        },
        {
          name: "FRONT",
          detail: "NOMINAL OPEN ASSEMBLY",
          eye: [0, -65, 3.5],
          target: [0, 0, 3.5],
          span: 29,
        },
        {
          name: "SIDE",
          detail: "NOMINAL OPEN ASSEMBLY",
          eye: [65, 0, 3.5],
          target: [0, 0, 3.5],
          span: 29,
        },
      ],
      footer:
        "POPPYGL / NOMINAL ASSEMBLY / UNTOLERANCED mm / REAL THROUGH BORE / NO MANUFACTURER INTERNAL CLAIM",
    }),
    import.meta.path,
  )
})
