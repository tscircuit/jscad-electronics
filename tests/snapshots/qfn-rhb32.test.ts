import { expect, test } from "bun:test"
import { qfnRhb32Footprint } from "../../examples/fixtures/qfn-rhb32"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("RHB32 VQFN: six-view footprint render", async () => {
  await expect(await renderContactSheet(qfnRhb32Footprint)).toMatchPngSnapshot(
    import.meta.path,
    "qfn-rhb32",
  )
}, 30000)
