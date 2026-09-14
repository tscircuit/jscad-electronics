import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("SWPA4030Inductor orientation 1", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm_inductorSWPA4030",
    ),
  ).toMatchPngSnapshot(import.meta.path, "swpa4030-inductor-1")
}, 30000)
