import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("tantalum C", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p5.1999mm_pw1.9mm_ph2.376mm_pin1location(rightside,top)_tantalumC",
    ),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-C")
}, 30000)
