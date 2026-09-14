import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("sot143", async () => {
  await expect(await renderContactSheet("sot143")).toMatchPngSnapshot(
    import.meta.path,
    "sot143",
  )
}, 30000)
