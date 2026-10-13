import { test } from "bun:test"
import { createBulkheadFittingMesh } from "../lib/models/bulkheadfitting"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("bulkheadfitting: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-bulkheadfitting",
    modelString:
      "bulkheadfitting_od20mm_bore12mm_l55mm_flange32mm_flanget4mm_af28mm_nutt8mm_gap10mm",
    mesh: createBulkheadFittingMesh({}),
  })
}, 60000)
