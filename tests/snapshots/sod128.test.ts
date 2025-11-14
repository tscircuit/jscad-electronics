import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOD128 diode", async () => {
  const pngBuffer = await renderFootprint("sod128")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
