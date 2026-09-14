import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("SWPA4030Inductor orientation 2", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm_inductorSWPA4030_pin1location(rightside,top)",
    ),
  ).toMatchPngSnapshot(import.meta.path, "swpa4030-inductor-2")
}, 30000)
