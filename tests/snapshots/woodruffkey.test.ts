import { test } from "bun:test"
import { createWoodruffKeyMesh } from "../../lib/models/woodruffkey"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("woodruffkey: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "woodruffkey",
    modelString: "woodruffkey_diameter30mm_thickness6mm_height12mm",
    mesh: createWoodruffKeyMesh(),
  })
}, 60000)
