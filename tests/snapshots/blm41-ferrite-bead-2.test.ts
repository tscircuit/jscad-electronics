import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
test("BLM41FerriteBead orientation 2", async () => {
  await expect(
    await renderContactSheet(
      "smdpads2_p3.8999mm_pw2mm_ph2mm_ferriteBLM41PG600SN1_pin1location(rightside,top)",
    ),
  ).toMatchPngSnapshot(import.meta.path, "blm41-ferrite-bead-2")
}, 30000)
