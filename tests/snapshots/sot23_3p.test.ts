import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT-23-3P transistor", async () => {
  const pngBuffer = await renderFootprint("sot23_3p")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
