import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { rightString } from "../fixtures/torsionspring-inputs"
import { renderTorsionSpringSnapshot } from "../fixtures/render-torsionspring-snapshot"
test("torsionspring right: labeled four-view snapshot", async () => {
  await expectPngSnapshot(
    await renderTorsionSpringSnapshot(rightString),
    import.meta.path,
  )
}, 30000)
