import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createDinRailMesh } from "../lib/models/dinrail"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("dinrail: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "dinrail_width35mm_height7.5mm_thickness1mm_length100mm_holediameter5mm_slotlength10mm_slotpitch25mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "dinrail") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "dinrail",
    modelString,
    mesh: createDinRailMesh(props),
  })
})
