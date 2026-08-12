import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT23-3P snapshot", async () => {
  const pngBuffer = await renderFootprint("sot23_3p")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})

test("SOT23-3P snapshot top view", async () => {
  const pngBuffer = await renderFootprint("sot23_3p", {
    cameraPreset: "top-down",
  })
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path, "sot23_3p_top")
})
