import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("smd-slide-switch-rotated", async () => {
  await expect(
    await renderContactSheet(
      "smdslideswitch7_pin1location(leftside,bottom)",
      "back",
    ),
  ).toMatchPngSnapshot(import.meta.path, "smd-slide-switch-rotated")
}, 30000)
