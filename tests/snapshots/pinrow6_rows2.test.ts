import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("6-pin pinrow with 2 rows", async () => {
  const pngBuffer = await renderFootprint(
    "pinrow6_rows2_p2.54mm_id1mm_od1.5mm_male",
    { camPos: [0, 18, 10], showBoard: true },
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
