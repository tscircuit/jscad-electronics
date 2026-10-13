import { test } from "bun:test"
import { createBridgeHandleMesh } from "../../lib/models/bridgehandle"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
test("bridgehandle: standard four-view snapshot", async () => {
  await assertIndustrialSnapshot({
    name: "bridgehandle",
    modelString:
      "bridgehandle_length120mm_gripdiameter15mm_height40mm_mountingdiameter24mm_mountingheight5mm_holediameter5mm",
    mesh: createBridgeHandleMesh(),
  })
}, 60000)
