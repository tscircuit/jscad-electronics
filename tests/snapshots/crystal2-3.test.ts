import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("FC1610AN", async () => {
  await expect(
    await renderContactSheet("smdpads2_p1.05mm_pw0.5mm_ph1mm_crystal2FC1610AN"),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-FC1610AN")
}, 30000)
