import { test } from "bun:test"
import { createHoseClampMesh } from "../lib/models/hoseclamp"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("hoseclamp: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-hoseclamp",
    modelString:
      "hoseclamp_id30mm_bandt1.5mm_bandw8mm_housingl14mm_housingw8mm_housingh7mm",
    mesh: createHoseClampMesh({}),
  })
}, 60000)
