import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("8-pin pinrow with 2 rows", async () => {
  const pngBuffer = await renderFootprint(
    "pinrow8_rows2_female_id01mm_p2.54mm_od01.6mm",
    {
      camPos: [0.001, -5, 10],
      lookAt: [0, 0, 0],
    },
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
