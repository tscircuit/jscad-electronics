import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createAirRegulatorMesh } from "../lib/models/airregulator"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("airregulator: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "airregulator_bodywidth40mm_bodydepth36mm_bodyheight30mm_knobdiameter28mm_knobheight20mm_portdiameter8mm_gaugediameter20mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "airregulator") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "airregulator",
    modelString,
    mesh: createAirRegulatorMesh(props),
  })
})
