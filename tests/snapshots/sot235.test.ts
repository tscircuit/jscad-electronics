import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT-235 (SOT-25) component", async () => {
  const pngBuffer = await renderFootprint("sot25")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
