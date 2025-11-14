import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SOT23W diode", async () => {
  const pngBuffer = await renderFootprint("sot23w")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
