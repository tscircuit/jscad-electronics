import { test } from "bun:test"
import { createCasterMesh } from "../../lib/models/caster"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("caster: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "caster",
    modelString:
      "caster_wheeldiameter75mm_wheelwidth24mm_axlediameter10mm_forkthickness5mm_platewidth50mm_platelength65mm_platethickness5mm_overallheight110mm_holediameter5mm",
    mesh: createCasterMesh(),
  })
}, 60000)
