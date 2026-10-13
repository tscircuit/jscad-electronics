import { test } from "bun:test"
import { createPipeCouplingMesh } from "../lib/models/pipecoupling"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipecoupling: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipecoupling",
    modelString: "pipecoupling_od30mm_bore16mm_socket20mm_l40mm_depth14mm",
    mesh: createPipeCouplingMesh({}),
  })
}, 60000)
