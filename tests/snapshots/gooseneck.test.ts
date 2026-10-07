import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { lampGooseneckString } from "../fixtures/gooseneck-inputs"
import { renderGooseneckSnapshot } from "../fixtures/render-gooseneck-snapshot"

test("gooseneck: four views of the ribbed reading-lamp arm", async () => {
  const png = await renderGooseneckSnapshot(
    lampGooseneckString,
    "GOOSENECK / READING LAMP ARM",
  )
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
