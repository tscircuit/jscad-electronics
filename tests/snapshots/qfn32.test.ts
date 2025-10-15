import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("QFN-32 IC package", async () => {
  const pngBuffer = await renderFootprint(
    "qfn32_w5_h5_p0.5_pw0.25_pl0.75_thermalpad3.1mmx3.1mm",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
