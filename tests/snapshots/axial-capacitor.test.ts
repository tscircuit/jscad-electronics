import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("Axial Capacitor 14mm pitch", async () => {
  const pngBuffer = await renderFootprint("axial_p14mm")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
