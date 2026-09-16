import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("MINIMELF package", async () => {
  const pngBuffer = await renderContactSheet("minimelf")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
}, 30000)
