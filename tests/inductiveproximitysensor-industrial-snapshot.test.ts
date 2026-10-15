import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createInductiveProximitySensorMesh } from "../lib/models/inductiveproximitysensor"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("inductiveproximitysensor: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "inductiveproximitysensor_barreldiameter18mm_barrellength55mm_facethickness2mm_cablediameter5mm_cablelength15mm_nutwidth22mm_nutthickness4mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "inductiveproximitysensor")
    throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "inductiveproximitysensor",
    modelString,
    mesh: createInductiveProximitySensorMesh(props),
  })
})
