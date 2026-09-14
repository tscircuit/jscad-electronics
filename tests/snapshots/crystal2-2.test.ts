import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("FC12M", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p1.7252mm_pw0.925mm_ph1.3mm_crystal2FC12M",
    ),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-FC12M")
}, 30000)
