import { test } from "bun:test"
import { createPipeElbowMesh } from "../lib/models/pipeelbow"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipeelbow: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipeelbow",
    modelString: "pipeelbow_od24mm_bore16mm_leg36mm_socket28mm_socketl10mm",
    mesh: createPipeElbowMesh({}),
  })
}, 60000)
