import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { compactString } from "../fixtures/finnedheatsink-inputs"
import { renderFinnedHeatsinkSnapshot } from "../fixtures/render-finnedheatsink-snapshot"
test("finnedheatsink compact: labeled four-view snapshot", async () => {
  await expectPngSnapshot(
    await renderFinnedHeatsinkSnapshot(compactString),
    import.meta.path,
  )
}, 30000)
