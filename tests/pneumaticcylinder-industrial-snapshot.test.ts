import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPneumaticCylinderMesh } from "../lib/models/pneumaticcylinder"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pneumaticcylinder: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "pneumaticcylinder_borediameter32mm_bodylength80mm_roddiameter12mm_stroke50mm_extension25mm_endcaplength10mm_portdiameter6mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "pneumaticcylinder") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "pneumaticcylinder",
    modelString,
    mesh: createPneumaticCylinderMesh(props),
  })
})
