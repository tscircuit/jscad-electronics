import { test } from "bun:test"
import { renderHexNutSnapshot } from "../fixtures/render-hex-nut-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("M3 / DIN REGULAR HEX NUT four-view snapshot", async () => {
  const image = await renderHexNutSnapshot(
    "hexnut_standard(din934)_m3",
    "M3 / DIN REGULAR HEX NUT",
  )
  await expectPngSnapshot(image, import.meta.path)
})
