import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("tantalum D", async () => {
  await expect(
    await renderContactSheet("smdpads2_p6mm_pw2.7991mm_ph3.0099mm_tantalumD"),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-D")
}, 30000)
