import { test } from "bun:test"
import { createToggleClampMesh } from "../../lib/models/toggleclamp"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("toggleclamp: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "toggleclamp",
    modelString:
      "toggleclamp_length110mm_width35mm_basethickness5mm_handleheight55mm_armlength75mm_paddiameter14mm_holediameter5mm",
    mesh: createToggleClampMesh(),
  })
}, 60000)
