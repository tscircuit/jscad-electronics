import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("C68883 MiniMELF on its recovered rectangular lands", async () => {
  await expect(
    await renderContactSheet("sod80_p3.5301mm_pl1.44mm_pw1.62mm"),
  ).toMatchPngSnapshot(import.meta.path)
}, 30000)
