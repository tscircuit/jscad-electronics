import { test } from "bun:test"
import { parseModelString } from "@tscircuit/modelprinter"
import { createLinearCarriageMesh } from "../../lib/models/linearcarriage"
import { linearcarriageExample } from "../fixtures/linearcarriage-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("linearcarriage standard four-view full-contract snapshot", async () => {
  const definition = parseModelString(linearcarriageExample)
  if (definition.fn !== "linearcarriage")
    throw new Error("Expected linearcarriage")
  const { fn, ...props } = definition
  const png = await renderModelSnapshot({
    mesh: createLinearCarriageMesh(props),
    title: "LINEAR CARRIAGE / MATCHING CHANNEL AND BLIND HOLES",
    modelString: linearcarriageExample,
    views: [
      {
        name: "ISOMETRIC",
        detail: "27 x 45 mm BODY / FOUR BLIND HOLES",
        eye: [55, -65, 50],
        target: [0, 0, 7.5],
        span: 62,
      },
      {
        name: "TOP",
        detail: "20 x 20 mm MOUNTING PATTERN",
        eye: [0, 0, 70],
        target: [0, 0, 7.5],
        span: 60,
      },
      {
        name: "FRONT",
        detail: "WAISTED CHANNEL / 0.15 mm CLEARANCE",
        eye: [0, -65, 7.5],
        target: [0, 0, 7.5],
        span: 35,
      },
      {
        name: "SIDE",
        detail: "13 mm ASSEMBLED HEIGHT / RAIL BED Z=0",
        eye: [65, 0, 7.5],
        target: [0, 0, 7.5],
        span: 58,
      },
    ],
    footer:
      "GENERIC DIMENSIONAL ENVELOPE / mm / NO SUPPLIER INTERCHANGEABILITY CLAIM",
  })
  await expectPngSnapshot(png, import.meta.path)
})
