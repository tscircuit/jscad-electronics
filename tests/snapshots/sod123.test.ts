import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOD123 diode", async () => {
  const pngBuffer = await renderFootprint("sod123")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
