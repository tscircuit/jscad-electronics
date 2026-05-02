import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("TSSOP-16 IC package", async () => {
  const pngBuffer = await renderFootprint(
    "tssop16_w4.5mm_p0.65mm_pl0.6mm_pw0.2mm",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
