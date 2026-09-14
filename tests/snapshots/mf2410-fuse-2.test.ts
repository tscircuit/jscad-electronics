import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("MF2410Fuse orientation 2", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p4.9997mm_pw2mm_ph3.2mm_fuseMF2410_pin1location(rightside,top)",
    ),
  ).toMatchPngSnapshot(import.meta.path, "mf2410-fuse-2")
}, 30000)
