import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPilotLightMesh } from "../lib/models/pilotlight"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pilotlight: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "pilotlight_paneldiameter22mm_lensdiameter28mm_bodylength28mm_lensheight8mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "pilotlight") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "pilotlight",
    modelString,
    mesh: createPilotLightMesh(props),
  })
})
