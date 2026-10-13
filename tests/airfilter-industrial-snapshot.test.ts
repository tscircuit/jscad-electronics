import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createAirFilterMesh } from "../lib/models/airfilter"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("airfilter: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "airfilter_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_drainlength8mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "airfilter") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "airfilter",
    modelString,
    mesh: createAirFilterMesh(props),
  })
})
