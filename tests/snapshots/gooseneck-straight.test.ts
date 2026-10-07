import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { straightGooseneckString } from "../fixtures/gooseneck-inputs"
import { renderGooseneckSnapshot } from "../fixtures/render-gooseneck-snapshot"

test("gooseneck: four views of the straight ribbed tube", async () => {
  const png = await renderGooseneckSnapshot(
    straightGooseneckString,
    "GOOSENECK / STRAIGHT ARM",
  )
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
