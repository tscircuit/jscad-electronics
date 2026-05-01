import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("QFP-64 IC package", async () => {
  const pngBuffer = await renderFootprint("qfp64")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
