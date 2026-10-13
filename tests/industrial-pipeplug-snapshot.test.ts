import { test } from "bun:test"
import { createPipePlugMesh } from "../lib/models/pipeplug"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipeplug: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipeplug",
    modelString: "pipeplug_d20mm_l20mm_af26mm_head8mm",
    mesh: createPipePlugMesh({}),
  })
}, 60000)
