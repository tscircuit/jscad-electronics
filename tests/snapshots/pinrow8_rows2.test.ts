import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("8-pin pinrow with 2 rowa ", async () => {
  const pngBuffer = await renderFootprint(
    "pinrow8_rows2_id01mm_p2.54mm_od01.6mm",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
