import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("MS-013 package", async () => {
  const pngBuffer = await renderFootprint("ms013")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
