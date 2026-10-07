import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createThrustBallBearingMesh } from "../../lib/models/thrustballbearing"
import { thrustBallBearingSource } from "../fixtures/thrust-ball-bearing-case"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-orthographic-model-snapshot"

test("thrust ball bearing assembled default in four views", async () => {
  const model = mp.string(thrustBallBearingSource).json()
  if (model.fn !== "thrustballbearing")
    throw new Error("Expected thrust bearing")
  const { fn, ...props } = model
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createThrustBallBearingMesh(props),
      title: "THRUST BEARING / WASHERS, BALLS AND CAGE",
      modelString: thrustBallBearingSource,
      views: [
        {
          name: "ISOMETRIC",
          detail: "OPEN BORE / SEPARATE WASHERS AND BALL BAND",
          eye: [30, -38, 31],
          target: [0, 0, 4.5],
          span: 30,
        },
        {
          name: "TOP",
          detail: "10mm THROUGH BORE / 24mm OUTSIDE",
          eye: [0, 0, 50],
          target: [0, 0, 4.5],
          span: 29,
        },
        {
          name: "FRONT",
          detail: "9mm ASSEMBLED HEIGHT / EXPOSED BALLS",
          eye: [0, -45, 4.5],
          target: [0, 0, 4.5],
          span: 24,
        },
        {
          name: "SIDE",
          detail: "Z=0 LOWER FACE / CAGE WITH THROUGH POCKETS",
          eye: [45, 0, 4.5],
          target: [0, 0, 4.5],
          span: 24,
        },
      ],
      footer:
        "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / NOMINAL INTERNALS / DATUM Z=0 LOWER MOUNTING FACE",
    }),
    import.meta.path,
  )
})
