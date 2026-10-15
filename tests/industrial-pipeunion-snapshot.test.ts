import { test } from "bun:test"
import { createPipeUnionMesh } from "../lib/models/pipeunion"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipeunion: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipeunion",
    modelString: "pipeunion_od30mm_bore16mm_l55mm_af36mm_nutl20mm_endod24mm",
    mesh: createPipeUnionMesh({}),
  })
}, 60000)
