import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("tantalum A", async () => {
  await expect(
    await renderContactSheet("smdpads2_p3.0602mm_pw1.53mm_ph1.296mm_tantalumA"),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-A")
}, 30000)
