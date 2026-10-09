import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createBallTransferUnitMesh } from "../../lib/models/balltransferunit"
import { ballTransferUnitString } from "../fixtures/balltransferunit-inputs"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("balltransferunit: labeled four views of the 25 mm ball and three-hole flange", async () => {
  const definition = mp.string(ballTransferUnitString).json()
  if (definition.fn !== "balltransferunit") throw new Error("Wrong family")
  const { fn, ...props } = definition
  const png = await renderModelSnapshot({
    mesh: createBallTransferUnitMesh(props),
    title: "BALL TRANSFER UNIT / THREE-HOLE MOUNTING FLANGE",
    modelString: ballTransferUnitString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "25 mm ROLLING BALL / CIRCULAR CUP",
        eye: [75, -95, 80],
        target: [0, 0, 15],
        span: 58,
      },
      {
        name: "TOP",
        detail: "45 mm FLANGE / 36 mm PCD / THREE 4 mm HOLES",
        eye: [0, 0, 150],
        target: [0, 0, 15],
        span: 61,
      },
      {
        name: "FRONT",
        detail: "30 mm OVERALL HEIGHT / BOTTOM AT Z=0",
        eye: [0, -140, 15],
        target: [0, 0, 15],
        span: 61,
      },
      {
        name: "SIDE",
        detail: "7.5 mm BALL PROTRUSION / 3 mm TOP FLANGE",
        eye: [140, 0, 15],
        target: [0, 0, 15],
        span: 61,
      },
    ],
    footer:
      "POPPYGL / ISOMETRIC + TOP + FRONT + SIDE / NOMINAL mm / OPEN THROUGH MOUNTING HOLES",
  })
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
