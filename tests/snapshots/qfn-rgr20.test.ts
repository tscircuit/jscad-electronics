import { expect, test } from "bun:test"
import { qfnRgr20Footprint } from "../../examples/fixtures/qfn-rgr20"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("RGR20 VQFN: six-view footprint render", async () => {
  await expect(await renderContactSheet(qfnRgr20Footprint)).toMatchPngSnapshot(
    import.meta.path,
    "qfn-rgr20",
  )
}, 30000)
