import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createHexBoltMesh } from "../../lib/models/hexbolt"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("hexbolt exact roadmap string - four views", async () => {
  const modelString =
    "hexbolt_standard(iso4017)_m6_l25mm_thread(full)_drive(hex)"
  const model = mp.string(modelString).json()
  if (model.fn !== "hexbolt") throw new Error("Wrong family")
  const { fn, ...props } = model
  const top = model.headHeight
  const fullHeight = model.length + top
  const target: [number, number, number] = [0, 0, (top - model.length) / 2]
  const png = await renderModelSnapshot({
    mesh: createHexBoltMesh(props),
    title: "HexBolt / modelprinter roadmap",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "mounting interface and helical thread",
        eye: [35, -45, 25],
        target,
        span: fullHeight * 1.65,
      },
      {
        name: "TOP",
        detail: "hexagonal drive",
        eye: [0, 0, 45],
        target: [0, 0, 0],
        span: 18,
      },
      {
        name: "FRONT",
        detail: "tip datum and full under-head length",
        eye: [0, -45, target[2]],
        target,
        span: fullHeight * 1.35,
      },
      {
        name: "SIDE",
        detail: "root blend and terminal chamfer",
        eye: [45, 0, target[2]],
        target,
        span: fullHeight * 1.35,
      },
    ],
    footer:
      "Pinned ISO geometry; actual drive, thread, fillet and chamfer surfaces",
  })
  await expectPngSnapshot(png, import.meta.path)
})
