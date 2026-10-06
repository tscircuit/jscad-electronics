import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createFlatHeadScrewMesh } from "../../lib/models/flatheadscrew"
import { renderModelSnapshot } from "../fixtures/render-orthographic-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("flatheadscrew exact roadmap string - four views", async () => {
  const modelString =
    "flatheadscrew_standard(iso10642)_m3_l10mm_drive(hexsocket)"
  const model = mp.string(modelString).json()
  if (model.fn !== "flatheadscrew") throw new Error("Wrong family")
  const { fn, ...props } = model
  const top = 0
  const fullHeight = model.length + top
  const target: [number, number, number] = [0, 0, (top - model.length) / 2]
  const png = await renderModelSnapshot({
    mesh: createFlatHeadScrewMesh(props),
    title: "FlatHeadScrew / modelprinter roadmap",
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
        name: "DRIVE DETAIL",
        detail: "blind socket",
        eye: [0, -12, 45],
        target: [0, 0, -0.5],
        span: 11,
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
