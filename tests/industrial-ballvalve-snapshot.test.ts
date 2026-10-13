import { test } from "bun:test"
import { createBallValveMesh } from "../lib/models/ballvalve"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("ballvalve: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-ballvalve",
    modelString:
      "ballvalve_od30mm_bore16mm_l65mm_endod24mm_handlel55mm_handlew10mm_stemh14mm_handlet4mm",
    mesh: createBallValveMesh({}),
  })
}, 60000)
