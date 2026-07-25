import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("SMD push button", async () => {
  const pngBuffer = await renderFootprint("smdpushbutton4")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
