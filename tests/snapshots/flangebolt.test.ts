import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createFlangeBoltMesh } from "../../lib/models/flangebolt"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("flangebolt complete model string four-view snapshot", async () => {
  const modelString = "flangebolt_m6_l25mm_fullthread_plainface",
    model = mp.string(modelString).json()
  if (model.fn !== "flangebolt") throw new Error("Wrong family")
  const { fn, ...props } = model
  const target: [number, number, number] = [0, 0, -9.1]
  const png = await renderModelSnapshot({
    mesh: createFlangeBoltMesh(props),
    title: "FlangeBolt / modelprinter",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "flange, blend and helical thread",
        eye: [35, -45, 25],
        target,
        span: 47,
      },
      {
        name: "TOP",
        detail: "plain flange and hexagonal drive",
        eye: [0, 0, 45],
        target: [0, 0, 0],
        span: 18,
      },
      {
        name: "FRONT",
        detail: "plain bearing datum at Z=0",
        eye: [0, -45, -9.1],
        target,
        span: 43,
      },
      {
        name: "SIDE",
        detail: "flange shoulder and terminal chamfer",
        eye: [45, 0, -9.1],
        target,
        span: 43,
      },
    ],
    footer:
      "ISO 4162:2012 head envelope; full threading is an explicit extension",
  })
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
