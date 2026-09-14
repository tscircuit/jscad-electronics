import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { MelfResistor } from "../../lib/MelfResistor"
test("MELF resistor 0102", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MelfResistor, {
        footprint: "smdpads2_p2.2001mm_pw1.1mm_ph1.1mm",
        size: "0102",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "melf-resistor-0102")
}, 30000)
