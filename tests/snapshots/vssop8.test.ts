import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("VSSOP-8 IC package", async () => {
  const pngBuffer = await renderFootprint("vssop8")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
