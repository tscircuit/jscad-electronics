import { test } from "bun:test"
import { assertBoltGeometry } from "../fixtures/assert-bolt-geometry"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderBoltSnapshot } from "../fixtures/render-bolt-snapshot"

test("M3 x 6mm hex socket bolt - four views", async () => {
  assertBoltGeometry()
  await expectPngSnapshot(await renderBoltSnapshot(), import.meta.path)
})
