import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createCylinderMountMesh } from "../lib/models/cylindermount"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("cylindermount: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "cylindermount_width50mm_depth25mm_height45mm_thickness5mm_borediameter20mm_holediameter5mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "cylindermount") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "cylindermount",
    modelString,
    mesh: createCylinderMountMesh(props),
  })
})
