import { test } from "bun:test"
import { createPushConnectFittingMesh } from "../lib/models/pushconnectfitting"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pushconnectfitting: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pushconnectfitting",
    modelString:
      "pushconnectfitting_od26mm_bore8mm_l40mm_tube12mm_collet20mm_colletl6mm_af28mm",
    mesh: createPushConnectFittingMesh({}),
  })
}, 60000)
