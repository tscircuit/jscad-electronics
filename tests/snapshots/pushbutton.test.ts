import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("Push button", async () => {
  const pngBuffer = await renderFootprint("pushbutton")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
