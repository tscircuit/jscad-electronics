import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("MELF resistor 0204", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p2.8mm_pw1.2mm_ph1.6002mm_melfresistor0204",
    ),
  ).toMatchPngSnapshot(import.meta.path, "melf-resistor-0204")
}, 30000)
