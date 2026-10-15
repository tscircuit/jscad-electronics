import { test } from "bun:test"
import { createRigidPipeMesh } from "../lib/models/rigidpipe"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("rigidpipe: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-rigidpipe",
    modelString: "rigidpipe_od20mm_bore16mm_l100mm",
    mesh: createRigidPipeMesh({}),
  })
}, 60000)
