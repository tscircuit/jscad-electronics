import { test } from "bun:test"
import { createHandwheelMesh } from "../../lib/models/handwheel"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("handwheel: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "handwheel",
    modelString:
      "handwheel_outerdiameter100mm_rimwidth12mm_hubdiameter28mm_hubheight25mm_borediameter12mm_spokes4",
    mesh: createHandwheelMesh(),
  })
}, 60000)
