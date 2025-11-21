import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT89 transistor", async () => {
  const pngBuffer = await renderFootprint("sot89")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
