import { test } from "bun:test"
import { createExpandedMetalMesh } from "../../lib/models/expandedmetal"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("expandedmetal: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "expandedmetal",
    modelString:
      "expandedmetal_width100mm_length100mm_thickness2mm_diamondwidth15mm_diamondlength30mm_strandwidth2mm_framewidth3mm",
    mesh: createExpandedMetalMesh(),
  })
}, 60000)
