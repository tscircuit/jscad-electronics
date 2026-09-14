import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("B3UTactileSwitch orientation 1", async () => {
  await expect(
    await renderContactSheet("smdpads2_p3.4mm_pw0.8mm_ph1.7mm_switchB3U1000P"),
  ).toMatchPngSnapshot(import.meta.path, "b3u-tactile-switch-1")
}, 30000)
