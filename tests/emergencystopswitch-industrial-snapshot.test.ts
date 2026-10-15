import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createEmergencyStopSwitchMesh } from "../lib/models/emergencystopswitch"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("emergencystopswitch: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "emergencystopswitch_paneldiameter22mm_headdiameter40mm_bodylength45mm_headheight18mm_collardiameter30mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "emergencystopswitch")
    throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "emergencystopswitch",
    modelString,
    mesh: createEmergencyStopSwitchMesh(props),
  })
})
