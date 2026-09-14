import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("MELF resistor 0102", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p2.2001mm_pw1.1mm_ph1.1mm_melfresistor0102",
    ),
  ).toMatchPngSnapshot(import.meta.path, "melf-resistor-0102")
}, 30000)
