import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test.each(["usba", "usbmicro"])(
  "%s receptacle pads",
  async (footprint) => {
    await expect(
      await renderContactSheet(footprint, "back"),
    ).toMatchPngSnapshot(import.meta.path, footprint)
  },
  30000,
)
