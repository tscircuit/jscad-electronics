import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("USB-C mid-mount connector", async () => {
  const pngBuffer = await renderFootprint("usbcmidmount16")
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
