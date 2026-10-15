import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPhotoelectricSensorMesh } from "../lib/models/photoelectricsensor"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("photoelectricsensor: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "photoelectricsensor_width20mm_depth35mm_height55mm_lensdiameter12mm_cablediameter5mm_mountholediameter4mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "photoelectricsensor")
    throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "photoelectricsensor",
    modelString,
    mesh: createPhotoelectricSensorMesh(props),
  })
})
