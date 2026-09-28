import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("Footprinter3d SOT-89 six-view outline", async () => {
  await expect(await renderContactSheet("sot89")).toMatchPngSnapshot(
    import.meta.path,
    "footprinter3d-sot89-standard",
  )
}, 30000)
