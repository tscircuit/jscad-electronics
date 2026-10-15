import { test } from "bun:test"
import { createSquareKeyMesh } from "../../lib/models/squarekey"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("squarekey: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "squarekey",
    modelString: "squarekey_width8mm_height8mm_length40mm_chamfer1mm",
    mesh: createSquareKeyMesh(),
  })
}, 60000)
