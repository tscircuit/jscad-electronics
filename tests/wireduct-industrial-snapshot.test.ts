import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createWireDuctMesh } from "../lib/models/wireduct"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("wireduct: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "wireduct_width40mm_height40mm_length100mm_thickness2mm_slotwidth4mm_slotpitch8mm_holediameter5mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "wireduct") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "wireduct",
    modelString,
    mesh: createWireDuctMesh(props),
  })
})
