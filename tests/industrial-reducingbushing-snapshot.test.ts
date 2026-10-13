import { test } from "bun:test"
import { createReducingBushingMesh } from "../lib/models/reducingbushing"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("reducingbushing: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-reducingbushing",
    modelString:
      "reducingbushing_od26mm_largebore18mm_smallbore10mm_l30mm_af30mm_hexl10mm",
    mesh: createReducingBushingMesh({}),
  })
}, 60000)
