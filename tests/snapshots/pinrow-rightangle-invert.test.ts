import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("6-pin through-hole right-angle pinrow mounted inverted", async () => {
  const pngBuffer = await renderFootprint("pinrow6_rightangle_invert")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
