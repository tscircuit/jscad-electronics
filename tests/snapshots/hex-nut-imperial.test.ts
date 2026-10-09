import { test } from "bun:test"
import { renderHexNutSnapshot } from "../fixtures/render-hex-nut-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("1/4-20 UNC / REGULAR HEX NUT four-view snapshot", async () => {
  const image = await renderHexNutSnapshot(
    "hexnut_imperial(1/4-20)",
    "1/4-20 UNC / REGULAR HEX NUT",
  )
  await expectPngSnapshot(image, import.meta.path)
})
