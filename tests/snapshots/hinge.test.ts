import { test } from "bun:test"
import { createHingeMesh } from "../../lib/models/hinge"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("hinge: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "hinge",
    modelString:
      "hinge_width60mm_length60mm_leafthickness3mm_barreldiameter10mm_pindiameter4mm_holediameter5mm",
    mesh: createHingeMesh(),
  })
}, 60000)
