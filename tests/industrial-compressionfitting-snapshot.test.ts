import { test } from "bun:test"
import { createCompressionFittingMesh } from "../lib/models/compressionfitting"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("compressionfitting: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-compressionfitting",
    modelString:
      "compressionfitting_od22mm_bore8mm_l40mm_tube12mm_af26mm_nutl10mm",
    mesh: createCompressionFittingMesh({}),
  })
}, 60000)
