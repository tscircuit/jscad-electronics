import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("QFP-128 large IC package", async () => {
  const pngBuffer = await renderFootprint(
    "qfp128_w15.4mm_p0.4mm_pw0.25mm_pl1.65mm",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
