import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createVacuumCupMesh } from "../lib/models/vacuumcup"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("vacuumcup: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "vacuumcup_diameter35mm_height22mm_neckdiameter12mm_necklength12mm_wallthickness2mm_borediameter6mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "vacuumcup") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "vacuumcup",
    modelString,
    mesh: createVacuumCupMesh(props),
  })
})
