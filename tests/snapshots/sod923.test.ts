import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOD923 diode", async () => {
  const pngBuffer = await renderFootprint("sod923")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})