import { expect, test } from "bun:test"
import { qfnRge24Footprint } from "../../examples/fixtures/qfn-rge24"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("RGE24 VQFN: six-view footprint render", async () => {
  await expect(await renderContactSheet(qfnRge24Footprint)).toMatchPngSnapshot(
    import.meta.path,
    "qfn-rge24",
  )
}, 30000)
