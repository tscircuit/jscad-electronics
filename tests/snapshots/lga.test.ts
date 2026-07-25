import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("LGA-16 package", async () => {
  const pngBuffer = await renderFootprint(
    "lga16_grid5x3_p0.5mm_w3.6mm_h3.6mm_pw0.28mm_pl0.8mm",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
