import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { MelfResistor } from "../../lib/MelfResistor"
test("MELF resistor 0207", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MelfResistor, {
        footprint: "smdpads2_p4.6mm_pw1.7mm_ph2.4mm_pin1location(leftside,top)",
        size: "0207",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "melf-resistor-0207")
}, 30000)
