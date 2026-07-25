import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("FPC-12 connector", async () => {
  const pngBuffer = await renderFootprint("fpc12")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
