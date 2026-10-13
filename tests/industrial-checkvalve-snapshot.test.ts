import { test } from "bun:test"
import { createCheckValveMesh } from "../lib/models/checkvalve"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("checkvalve: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-checkvalve",
    modelString: "checkvalve_od28mm_bore12mm_l60mm_endod20mm_af30mm_nutl12mm",
    mesh: createCheckValveMesh({}),
  })
}, 60000)
