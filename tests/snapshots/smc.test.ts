import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SMC diode", async () => {
  const pngBuffer = await renderFootprint("smc")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})