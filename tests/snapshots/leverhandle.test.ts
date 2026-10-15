import { test } from "bun:test"
import { createLeverHandleMesh } from "../../lib/models/leverhandle"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("leverhandle: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "leverhandle",
    modelString:
      "leverhandle_length90mm_width18mm_height16mm_hubdiameter28mm_hubheight25mm_borediameter8mm",
    mesh: createLeverHandleMesh(),
  })
}, 60000)
