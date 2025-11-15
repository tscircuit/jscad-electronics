import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOD323 diode", async () => {
  const pngBuffer = await renderFootprint("sod323")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
