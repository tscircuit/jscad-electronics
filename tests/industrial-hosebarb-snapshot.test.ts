import { test } from "bun:test"
import { createHoseBarbMesh } from "../lib/models/hosebarb"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("hosebarb: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-hosebarb",
    modelString:
      "hosebarb_od20mm_bore10mm_l45mm_barbod16mm_barbl25mm_pitch6mm_af24mm",
    mesh: createHoseBarbMesh({}),
  })
}, 60000)
