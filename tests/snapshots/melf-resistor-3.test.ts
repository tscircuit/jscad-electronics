import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("MELF resistor 0207", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p4.6mm_pw1.7mm_ph2.4mm_pin1location(leftside,top)_melfresistor0207",
    ),
  ).toMatchPngSnapshot(import.meta.path, "melf-resistor-0207")
}, 30000)
