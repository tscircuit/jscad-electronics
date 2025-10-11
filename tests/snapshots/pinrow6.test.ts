import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("6-pin header connector", async () => {
  const pngBuffer = await renderFootprint("pinrow6_id01mm_p2.54mm_od01.6mm")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
