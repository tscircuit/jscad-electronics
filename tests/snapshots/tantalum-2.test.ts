import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("tantalum B", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p3.7211mm_pw1.5062mm_ph2.376mm_tantalumB",
    ),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-B")
}, 30000)
