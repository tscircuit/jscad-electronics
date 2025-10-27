import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOD123F diode", async () => {
  const pngBuffer = await renderFootprint("sod123f")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
