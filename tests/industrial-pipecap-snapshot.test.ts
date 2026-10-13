import { test } from "bun:test"
import { createPipeCapMesh } from "../lib/models/pipecap"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipecap: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipecap",
    modelString: "pipecap_od30mm_socket20mm_l25mm_floor4mm_af32mm",
    mesh: createPipeCapMesh({}),
  })
}, 60000)
