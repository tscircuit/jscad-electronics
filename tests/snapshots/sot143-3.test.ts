import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("sot143-pin1-opposite", async () => {
  await expect(
    await renderContactSheet("sot143_pin1location(topside,right)"),
  ).toMatchPngSnapshot(import.meta.path, "sot143-pin1-opposite")
}, 30000)
