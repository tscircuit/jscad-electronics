import { test } from "bun:test"
import { createDrawLatchMesh } from "../../lib/models/drawlatch"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("drawlatch: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "drawlatch",
    modelString:
      "drawlatch_length100mm_width25mm_basethickness4mm_handleheight18mm_wirediameter4mm_holediameter4mm",
    mesh: createDrawLatchMesh(),
  })
}, 60000)
