import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOIC-8 IC package", async () => {
  const pngBuffer = await renderFootprint("soic8")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
