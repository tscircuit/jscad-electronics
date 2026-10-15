import { test } from "bun:test"
import { createRubberBumperMesh } from "../../lib/models/rubberbumper"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("rubberbumper: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "rubberbumper",
    modelString:
      "rubberbumper_diameter30mm_height15mm_holediameter6mm_counterborediameter13mm_counterboredepth5mm",
    mesh: createRubberBumperMesh(),
  })
}, 60000)
