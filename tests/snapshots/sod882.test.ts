import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOD882 diode", async () => {
  const pngBuffer = await renderFootprint("sod882")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
