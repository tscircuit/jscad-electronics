import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("TO92 inline", async () => {
  const pngBuffer = await renderFootprint("to92_inline", {
    cameraPreset: "top-left",
  })
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
