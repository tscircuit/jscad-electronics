import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { leftString } from "../fixtures/torsionspring-inputs"
import { renderTorsionSpringSnapshot } from "../fixtures/render-torsionspring-snapshot"
test("torsionspring left: labeled four-view snapshot", async () => {
  await expectPngSnapshot(
    await renderTorsionSpringSnapshot(leftString),
    import.meta.path,
  )
}, 30000)
