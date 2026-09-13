import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
for (const [name, footprint] of [
  ["sot143", "sot143"],
  ["sot143-rotated", "sot143_pin1location(leftside,top)"],
  ["sot143-pin1-opposite", "sot143_pin1location(topside,right)"],
])
  test(name!, async () => {
    await expect(await renderContactSheet(footprint!)).toMatchPngSnapshot(
      import.meta.path,
      name,
    )
  }, 30000)
