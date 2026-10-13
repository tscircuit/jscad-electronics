import { test } from "bun:test"
import { createNeedleValveMesh } from "../lib/models/needlevalve"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("needlevalve: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-needlevalve",
    modelString:
      "needlevalve_bodyl38mm_bodyw24mm_bodyh26mm_bore8mm_port16mm_portl10mm_stemh24mm_wheel26mm_wheelt5mm",
    mesh: createNeedleValveMesh({}),
  })
}, 60000)
