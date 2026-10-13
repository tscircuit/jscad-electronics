import { test } from "bun:test"
import { createBarrelHingeMesh } from "../../lib/models/barrelhinge"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("barrelhinge: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "barrelhinge",
    modelString:
      "barrelhinge_height60mm_barreldiameter14mm_pindiameter6mm_leafwidth20mm_leafthickness4mm_holediameter5mm",
    mesh: createBarrelHingeMesh(),
  })
}, 60000)
