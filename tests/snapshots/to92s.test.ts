import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("TO92S", async () => {
  const pngBuffer = await renderFootprint("to92s")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
