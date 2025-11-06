import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("MS-012 package", async () => {
  const pngBuffer = await renderFootprint("ms012")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
