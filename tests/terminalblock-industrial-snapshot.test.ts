import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createTerminalBlockMesh } from "../lib/models/terminalblock"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
test("terminalblock: standard four-view nominal assembly snapshot", async () => {
  const modelString =
    "terminalblock_width6mm_depth40mm_height35mm_wirediameter3mm_screwdiameter4mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "terminalblock") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  await assertIndustrialSnapshot({
    name: "terminalblock",
    modelString,
    mesh: createTerminalBlockMesh(props),
  })
})
