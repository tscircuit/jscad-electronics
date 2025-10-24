import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SMF diode", async () => {
  const pngBuffer = await renderFootprint("smf")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
