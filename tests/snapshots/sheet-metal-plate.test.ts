import { test } from "bun:test"
import { assertSheetMetalGeometry } from "../fixtures/assert-sheet-metal-geometry"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderSheetMetalSnapshot } from "../fixtures/render-sheet-metal-snapshot"

test("sheet metal plate - four views", async () => {
  assertSheetMetalGeometry()
  await expectPngSnapshot(await renderSheetMetalSnapshot(0), import.meta.path)
})
