import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("DIP-8 through-hole package", async () => {
  const pngBuffer = await renderFootprint("dip8")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
