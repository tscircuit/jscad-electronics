import { test } from "bun:test"
import { createPipeCrossMesh } from "../lib/models/pipecross"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipecross: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipecross",
    modelString: "pipecross_od24mm_bore16mm_span70mm_socket28mm_socketl10mm",
    mesh: createPipeCrossMesh({}),
  })
}, 60000)
