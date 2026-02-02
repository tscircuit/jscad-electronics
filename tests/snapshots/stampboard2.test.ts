import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("stampboard receiver with inner holes", async () => {
  const pngBuffer = await renderFootprint(
    "stampreceiver_left10_right20_bottom6_top3_w21mm_innerhole",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
}, 10000)
