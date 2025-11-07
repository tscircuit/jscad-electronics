import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("MINIMELF package", async () => {
  const pngBuffer = await renderFootprint("minimelf")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
