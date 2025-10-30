import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT223 diode", async () => {
  const pngBuffer = await renderFootprint("sot223")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
