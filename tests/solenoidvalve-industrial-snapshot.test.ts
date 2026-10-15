import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createSolenoidValveMesh } from "../lib/models/solenoidvalve"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("solenoidvalve: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "solenoidvalve_length70mm_width28mm_height25mm_coilwidth24mm_coilheight30mm_portdiameter6mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "solenoidvalve") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "solenoidvalve",
    modelString,
    mesh: createSolenoidValveMesh(props),
  })
})
