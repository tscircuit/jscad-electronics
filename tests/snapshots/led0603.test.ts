import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("led0603", async () => {
  const pngBuffer = await renderFootprint("led0603")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
