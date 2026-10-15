import { test } from "bun:test"
import { createPipeTeeMesh } from "../lib/models/pipetee"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipetee: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipetee",
    modelString:
      "pipetee_od24mm_bore16mm_l70mm_branch35mm_socket28mm_socketl10mm",
    mesh: createPipeTeeMesh({}),
  })
}, 60000)
