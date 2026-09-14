import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("FC135", async () => {
  await expect(
    await renderContactSheet("smdpads2_p2.5mm_pw1mm_ph1.8mm_crystal2FC135"),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-FC135")
}, 30000)
