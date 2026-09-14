import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("jst-sh-12-pad-derived", async () => {
  await expect(
    await renderContactSheet(
      "jst12_smd_p1mm_pw0.6mm_pl1.55mm_mpx13.5999mm_mpy2.525mm_mpw1.2mm_mpl1.8mm",
    ),
  ).toMatchPngSnapshot(import.meta.path, "jst-sh-12-pad-derived")
}, 30000)
