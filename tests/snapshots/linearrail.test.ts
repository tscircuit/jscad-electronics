import { test } from "bun:test"
import { parseModelString } from "@tscircuit/modelprinter"
import { createLinearRailMesh } from "../../lib/models/linearrail"
import { linearrailExample } from "../fixtures/linearrail-example"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("linearrail standard four-view full-contract snapshot", async () => {
  const definition = parseModelString(linearrailExample)
  if (definition.fn !== "linearrail") throw new Error("Expected linearrail")
  const { fn, ...props } = definition
  const png = await renderModelSnapshot({
    mesh: createLinearRailMesh(props),
    title: "LINEAR RAIL / WAISTED PROFILE AND MOUNTING HOLES",
    modelString: linearrailExample,
    views: [
      {
        name: "ISOMETRIC",
        detail: "WAISTED RAIL / FOUR COUNTERBORED HOLES",
        eye: [48, -20, 50],
        target: [0, 50, 4],
        span: 126,
      },
      {
        name: "TOP",
        detail: "100 mm LENGTH / 25 mm HOLE PITCH",
        eye: [0, 50, 90],
        target: [0, 50, 4],
        span: 140,
      },
      {
        name: "FRONT",
        detail: "12 x 8 mm PROFILE / 8 mm NECK",
        eye: [0, -35, 4],
        target: [0, 30, 4],
        span: 20,
      },
      {
        name: "SIDE",
        detail: "RAIL BED Z=0 / TOP CHAMFERS",
        eye: [70, 50, 4],
        target: [0, 50, 4],
        span: 122,
      },
    ],
    footer:
      "GENERIC DIMENSIONAL ENVELOPE / mm / NO SUPPLIER INTERCHANGEABILITY CLAIM",
  })
  await expectPngSnapshot(png, import.meta.path)
})
