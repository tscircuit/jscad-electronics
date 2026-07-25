import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("WSON-8 package", async () => {
  const pngBuffer = await renderFootprint("wson8_ep")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
