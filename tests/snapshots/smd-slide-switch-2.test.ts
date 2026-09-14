import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("smd-slide-switch-wide", async () => {
  await expect(
    await renderContactSheet(
      "smdslideswitch7_signalcols4_missing(2)_p1.5mm_pw0.6mm_pl1.524mm_mounty-2.2501mm_mpx7.1999mm_mpy2.3mm_mpw1.2mm_mpl0.7mm_holex1.5mm_holey-2.2502mm_holed0.9mm",
      "back",
    ),
  ).toMatchPngSnapshot(import.meta.path, "smd-slide-switch-wide")
}, 30000)
