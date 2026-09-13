import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
for (const [name, footprint] of [
  ["jst-sh-2", "jst2_sh"],
  [
    "jst-sh-12-pad-derived",
    "jst12_smd_p1mm_pw0.6mm_pl1.55mm_mpx13.5999mm_mpy2.525mm_mpw1.2mm_mpl1.8mm",
  ],
  ["jst-sh-rotated", "jst4_sh_pin1location(leftside,top)"],
])
  test(name!, async () => {
    await expect(await renderContactSheet(footprint!)).toMatchPngSnapshot(
      import.meta.path,
      name,
    )
  }, 30000)
