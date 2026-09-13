import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
for (const [name, footprint] of [
  ["smd-slide-switch-mini", "smdslideswitch7"],
  [
    "smd-slide-switch-wide",
    "smdslideswitch7_signalcols4_missing(2)_p1.5mm_pw0.6mm_pl1.524mm_mounty-2.2501mm_mpx7.1999mm_mpy2.3mm_mpw1.2mm_mpl0.7mm_holex1.5mm_holey-2.2502mm_holed0.9mm",
  ],
  ["smd-slide-switch-rotated", "smdslideswitch7_pin1location(leftside,bottom)"],
])
  test(name!, async () => {
    await expect(
      await renderContactSheet(footprint!, "back"),
    ).toMatchPngSnapshot(import.meta.path, name)
  }, 30000)
