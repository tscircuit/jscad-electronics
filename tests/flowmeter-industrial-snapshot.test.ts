import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createFlowMeterMesh } from "../lib/models/flowmeter"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("flowmeter: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "flowmeter_length120mm_diameter24mm_borediameter12mm_enddiameter32mm_endlength12mm_floatdiameter8mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "flowmeter") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "flowmeter",
    modelString,
    mesh: createFlowMeterMesh(props),
  })
})
