import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createLimitSwitchMesh } from "../lib/models/limitswitch"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("limitswitch: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "limitswitch_width30mm_depth20mm_height55mm_actuatorlength30mm_rollerdiameter12mm_leverthickness3mm_holediameter4mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "limitswitch") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "limitswitch",
    modelString,
    mesh: createLimitSwitchMesh(props),
  })
})
