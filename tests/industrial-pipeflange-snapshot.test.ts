import { test } from "bun:test"
import { createPipeFlangeMesh } from "../lib/models/pipeflange"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pipeflange: standard four-view nominal geometry", async () => {
  await assertIndustrialSnapshot({
    name: "industrial-pipeflange",
    modelString:
      "pipeflange_flange70mm_bore16mm_hub30mm_flanget8mm_hubl20mm_bc50mm_hole6mm_bolts4",
    mesh: createPipeFlangeMesh({}),
  })
}, 60000)
