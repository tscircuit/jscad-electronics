import { test } from "bun:test"
import { createSplitRingHangerMesh } from "../../lib/models/splitringhanger"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("splitringhanger: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "splitringhanger",
    modelString:
      "splitringhanger_pipediameter32mm_bandthickness3mm_bandwidth15mm_gap2mm_lugwidth14mm_holediameter5mm",
    mesh: createSplitRingHangerMesh(),
  })
}, 60000)
