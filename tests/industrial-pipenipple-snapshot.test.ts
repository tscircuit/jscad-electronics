import { test } from "bun:test"
import { createPipeNippleMesh } from "../lib/models/pipenipple"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipenipple: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipenipple",
    modelString: "pipenipple_od20mm_bore16mm_l50mm_threadl12mm_shoulder22mm",
    mesh: createPipeNippleMesh({}),
  })
}, 60000)
