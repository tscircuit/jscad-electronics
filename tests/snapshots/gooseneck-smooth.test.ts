import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { smoothGooseneckString } from "../fixtures/gooseneck-inputs"
import { renderGooseneckSnapshot } from "../fixtures/render-gooseneck-snapshot"

test("gooseneck: four views of the smooth U bend", async () => {
  const png = await renderGooseneckSnapshot(
    smoothGooseneckString,
    "GOOSENECK / SMOOTH U BEND",
  )
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
