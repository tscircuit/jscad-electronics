import { test } from "bun:test"
import { createIBeamMesh } from "../../lib/models/ibeam"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("ibeam: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "ibeam",
    modelString:
      "ibeam_width40mm_height60mm_webthickness4mm_flangethickness6mm_length100mm",
    mesh: createIBeamMesh(),
  })
}, 60000)
