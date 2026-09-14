import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { CeramicChipAntenna } from "../../lib/CeramicChipAntenna"
test("RFANT orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(CeramicChipAntenna, {
        footprint: "smdpads2_p5.4mm_pw1mm_ph2mm",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "ceramic-chip-antenna-1")
}, 30000)
