import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderSheetMetalSnapshot } from "../fixtures/render-sheet-metal-snapshot"

test("sheet metal channel - four views", async () => {
  await expectPngSnapshot(await renderSheetMetalSnapshot(2), import.meta.path)
})
