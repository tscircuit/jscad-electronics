import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("JST PH 4-pin", async () => {
  const pngBuffer = await renderFootprint("jst4_ph")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
