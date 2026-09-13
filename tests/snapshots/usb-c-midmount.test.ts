import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
for (const [name, footprint] of [
  [
    "usb-c-midmount-long-slots",
    "usbcmidmount16_tophw0.8mm_bottomhw0.8mm_tophh1.6mm_bottomhh1.4mm_topring0.2mm_bottomring0.2mm_rowy2.174mm_ph1.3mm_pw0.3mm_powerpw0.6mm_powerx3.2mm_shellx4.3251mm_topy1.4057mm_bottomy2.7741mm_holex2.8999mm_holey0.9056mm_holed0.75mm",
  ],
])
  test(name!, async () => {
    await expect(
      await renderContactSheet(footprint!, "back"),
    ).toMatchPngSnapshot(import.meta.path, name)
  }, 30000)
