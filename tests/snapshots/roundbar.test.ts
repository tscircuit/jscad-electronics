import { test } from "bun:test"
import { createRoundBarMesh } from "../../lib/models/roundbar"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("roundbar: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "roundbar",
    modelString: "roundbar_diameter20mm_length100mm_chamfer1mm",
    mesh: createRoundBarMesh(),
  })
}, 60000)
