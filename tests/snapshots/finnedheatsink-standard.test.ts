import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { standardString } from "../fixtures/finnedheatsink-inputs"
import { renderFinnedHeatsinkSnapshot } from "../fixtures/render-finnedheatsink-snapshot"
test("finnedheatsink standard: labeled four-view snapshot", async () => {
  await expectPngSnapshot(
    await renderFinnedHeatsinkSnapshot(standardString),
    import.meta.path,
  )
}, 30000)
