import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createAirLubricatorMesh } from "../lib/models/airlubricator"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("airlubricator: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "airlubricator_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_filldiameter12mm_fillheight8mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "airlubricator") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "airlubricator",
    modelString,
    mesh: createAirLubricatorMesh(props),
  })
})
