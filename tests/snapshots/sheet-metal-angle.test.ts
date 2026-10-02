import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderSheetMetalSnapshot } from "../fixtures/render-sheet-metal-snapshot"

test("sheet metal angle - four views", async () => {
  await expectPngSnapshot(await renderSheetMetalSnapshot(1), import.meta.path)
})
