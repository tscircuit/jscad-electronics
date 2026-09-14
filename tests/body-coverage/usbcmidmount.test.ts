import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
import { probeFor } from "./footprint-probes"
test("usbcmidmount six-view body coverage", async () => {
  await expect(
    await renderContactSheet(probeFor("usbcmidmount"), "back"),
  ).toMatchPngSnapshot(import.meta.path)
}, 30000)
