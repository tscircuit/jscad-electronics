import { test } from "bun:test"
import { createLevelingFootMesh } from "../../lib/models/levelingfoot"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("levelingfoot: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "levelingfoot",
    modelString:
      "levelingfoot_basediameter50mm_baseheight12mm_stemdiameter12mm_stemlength55mm_hexdiameter24mm_hexheight8mm",
    mesh: createLevelingFootMesh(),
  })
}, 60000)
