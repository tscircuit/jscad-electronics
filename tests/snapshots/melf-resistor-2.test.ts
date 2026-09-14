import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { MelfResistor } from "../../lib/MelfResistor"
test("MELF resistor 0204", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MelfResistor, {
        footprint: "smdpads2_p2.8mm_pw1.2mm_ph1.6002mm",
        size: "0204",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "melf-resistor-0204")
}, 30000)
