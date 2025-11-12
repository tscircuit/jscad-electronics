import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT363 diode", async () => {
  const pngBuffer = await renderFootprint("sot363")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
