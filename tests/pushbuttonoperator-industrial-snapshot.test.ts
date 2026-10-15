import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createPushbuttonOperatorMesh } from "../lib/models/pushbuttonoperator"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("pushbuttonoperator: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "pushbuttonoperator_paneldiameter22mm_bezeldiameter30mm_buttondiameter22mm_bodylength35mm_buttonheight8mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "pushbuttonoperator")
    throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "pushbuttonoperator",
    modelString,
    mesh: createPushbuttonOperatorMesh(props),
  })
})
