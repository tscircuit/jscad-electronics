import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("jst-sh-rotated", async () => {
  await expect(
    await renderContactSheet("jst4_sh_pin1location(leftside,top)"),
  ).toMatchPngSnapshot(import.meta.path, "jst-sh-rotated")
}, 30000)
