import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("6-pin vertical SMD pin header", async () => {
  const pngBuffer = await renderFootprint("smdpinheader6_py3.31mm")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
