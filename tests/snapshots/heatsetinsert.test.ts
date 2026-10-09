import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createHeatSetInsertMesh } from "../../lib/models/heatsetinsert"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
test("heatsetinsert complete model string four-view snapshot", async () => {
  const modelString =
      "heatsetinsert_m3_od4.6mm_l5mm_knurldepth0.2mm_knurlp0.6mm_knurlteeth24_diamondknurl",
    model = mp.string(modelString).json()
  if (model.fn !== "heatsetinsert") throw new Error("Wrong family")
  const { fn, ...props } = model
  const target: [number, number, number] = [0, 0, 2.5]
  const png = await renderModelSnapshot({
    mesh: createHeatSetInsertMesh(props),
    title: "HeatSetInsert / modelprinter",
    color: [0.67, 0.48, 0.23, 1],
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "diamond knurl and through thread",
        eye: [12, -15, 9],
        target,
        span: 10,
      },
      {
        name: "TOP",
        detail: "open threaded bore",
        eye: [0, 0, 14],
        target: [0, 0, 5],
        span: 6.5,
      },
      {
        name: "FRONT",
        detail: "full-length crossed diamond knurl",
        eye: [0, -15, 2.5],
        target,
        span: 8,
      },
      {
        name: "SIDE",
        detail: "flat unflanged end planes",
        eye: [15, 0, 2.5],
        target,
        span: 8,
      },
    ],
    footer: "Nominal M3 thread; radial knurl depth 0.2 mm; no implicit flanges",
  })
  await expectPngSnapshot(png, import.meta.path)
}, 60000)
