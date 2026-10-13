import { test } from "bun:test"
import { createDetentPinMesh } from "../../lib/models/detentpin"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("detentpin: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "detentpin",
    modelString:
      "detentpin_shaftdiameter8mm_shaftlength50mm_headdiameter18mm_headheight6mm_balldiameter3mm_balloffset4mm_ringdiameter24mm_ringwire2mm",
    mesh: createDetentPinMesh(),
  })
}, 60000)
