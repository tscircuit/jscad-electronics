import { test } from "bun:test"
import { createCoolingFanMesh } from "../../lib/models/coolingfan"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("coolingfan: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "coolingfan",
    modelString:
      "coolingfan_size80mm_thickness25mm_hubdiameter28mm_bladecount7_bladewidth12mm_bladethickness3mm_mountingholediameter4mm_framethickness6mm",
    mesh: createCoolingFanMesh(),
  })
}, 60000)
