import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("Radial electrolytic capacitor", async () => {
  const pngBuffer = await renderFootprint("electrolytic_d10.5mm_p7.5mm")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
