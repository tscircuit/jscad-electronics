import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("jst-sh-2", async () => {
  await expect(await renderContactSheet("jst2_sh")).toMatchPngSnapshot(
    import.meta.path,
    "jst-sh-2",
  )
}, 30000)
