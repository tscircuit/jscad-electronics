import { test } from "bun:test"
import { createManifoldMesh } from "../lib/models/manifold"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("manifold: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-manifold",
    modelString:
      "manifold_l100mm_w30mm_h26mm_bore12mm_port8mm_pitch25mm_ports3_hole5mm",
    mesh: createManifoldMesh({}),
  })
}, 60000)
