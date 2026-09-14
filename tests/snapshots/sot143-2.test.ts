import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("sot143-rotated", async () => {
  await expect(
    await renderContactSheet("sot143_pin1location(leftside,top)"),
  ).toMatchPngSnapshot(import.meta.path, "sot143-rotated")
}, 30000)
