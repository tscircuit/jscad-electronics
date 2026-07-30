import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("led5050", async () => {
  const pngBuffer = await renderFootprint("led5050")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
