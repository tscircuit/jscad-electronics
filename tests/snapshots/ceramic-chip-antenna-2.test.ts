import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("RFANT orientation 2", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p5.4mm_pw1mm_ph2mm_pin1location(rightside,top)_antennaRFANT5220110A0T",
    ),
  ).toMatchPngSnapshot(import.meta.path, "ceramic-chip-antenna-2")
}, 30000)
