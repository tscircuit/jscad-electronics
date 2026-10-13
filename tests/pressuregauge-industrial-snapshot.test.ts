import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPressureGaugeMesh } from "../lib/models/pressuregauge"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pressuregauge: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "pressuregauge_diameter60mm_depth22mm_stemdiameter10mm_stemlength15mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "pressuregauge") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const parts = createPressureGaugeMesh(props).parts
  const rgba = (
    color: [number, number, number],
  ): [number, number, number, number] => [...color, 1]
  const housing = parts[0]!
  await assertIndustrialSnapshot({
    name: "pressuregauge",
    modelString,
    mesh: housing.mesh,
    color: rgba(housing.color),
    additionalMeshes: parts
      .slice(1)
      .map((part) => ({ mesh: part.mesh, color: rgba(part.color) })),
  })
})
