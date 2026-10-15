import { test } from "bun:test"
import { createStarKnobMesh } from "../../lib/models/starknob"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("starknob: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "starknob",
    modelString:
      "starknob_diameter40mm_height16mm_borediameter6mm_lobes5_hubdiameter18mm_hubheight10mm",
    mesh: createStarKnobMesh(),
  })
}, 60000)
