import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("NX3225GD", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p1.8999mm_pw1.5mm_ph2.7mm_pin1location(rightside,top)_crystal2NX3225GD",
    ),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-NX3225GD")
}, 30000)
