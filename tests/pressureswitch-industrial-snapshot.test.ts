import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPressureSwitchMesh } from "../lib/models/pressureswitch"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pressureswitch: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "pressureswitch_width32mm_depth28mm_height38mm_portdiameter8mm_portlength10mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "pressureswitch") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "pressureswitch",
    modelString,
    mesh: createPressureSwitchMesh(props),
  })
})
