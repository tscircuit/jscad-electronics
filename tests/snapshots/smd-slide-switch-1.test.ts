import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("smd-slide-switch-mini", async () => {
  await expect(
    await renderContactSheet("smdslideswitch7", "back"),
  ).toMatchPngSnapshot(import.meta.path, "smd-slide-switch-mini")
}, 30000)
