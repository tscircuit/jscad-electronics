import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createSetScrewMesh } from "../../lib/models/setscrew"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("setscrew complete model string four-view snapshot", async () => {
  const modelString = "setscrew_standard(iso4029)_m3_l6mm_hexsocket_cuppoint",
    model = mp.string(modelString).json()
  if (model.fn !== "setscrew") throw new Error("Wrong family")
  const { fn, ...props } = model
  const target: [number, number, number] = [0, 0, -3]
  const png = await renderModelSnapshot({
    mesh: createSetScrewMesh(props),
    title: "SetScrew / modelprinter",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "hex socket and helical thread",
        eye: [12, -15, 9],
        target,
        span: 10,
      },
      {
        name: "TOP",
        detail: "open blind hexagonal socket",
        eye: [0, 0, 14],
        target: [0, 0, 0],
        span: 4.5,
      },
      {
        name: "FRONT",
        detail: "headless fully threaded body",
        eye: [0, -15, -3],
        target,
        span: 8,
      },
      {
        name: "SIDE",
        detail: "tapered cup-point contact ring",
        eye: [15, 0, -3],
        target,
        span: 8,
      },
    ],
    footer: "ISO 4029:2003 pinned dimensions; nominal cup and thread profile",
  })
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
