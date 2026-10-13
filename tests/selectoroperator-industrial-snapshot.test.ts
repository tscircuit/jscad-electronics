import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createSelectorOperatorMesh } from "../lib/models/selectoroperator"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("selectoroperator: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "selectoroperator_paneldiameter22mm_bezeldiameter30mm_bodylength35mm_knobwidth28mm_knobdepth10mm_knobheight15mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "selectoroperator") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "selectoroperator",
    modelString,
    mesh: createSelectorOperatorMesh(props),
  })
})
