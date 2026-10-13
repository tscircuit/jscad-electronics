import { test } from "bun:test"
import { createTeeBarMesh } from "../../lib/models/teebar"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("teebar: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "teebar",
    modelString:
      "teebar_width40mm_height40mm_webthickness4mm_flangethickness6mm_length100mm",
    mesh: createTeeBarMesh(),
  })
}, 60000)
