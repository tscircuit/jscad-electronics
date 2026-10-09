import { test } from "bun:test"
import { renderHexNutSnapshot } from "../fixtures/render-hex-nut-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("#6-32 UNC / SMALL HEX NUT four-view snapshot", async () => {
  const image = await renderHexNutSnapshot(
    "hexnut_imperial(#6-32)",
    "#6-32 UNC / SMALL HEX NUT",
  )
  await expectPngSnapshot(image, import.meta.path)
})
