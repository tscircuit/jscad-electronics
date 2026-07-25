import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("Crystal-4 package", async () => {
  const pngBuffer = await renderFootprint("crystal4")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
