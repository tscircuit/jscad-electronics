import { test } from "bun:test"
import { mp, getTimingBeltDimensions } from "@tscircuit/modelprinter"
import { createTimingBeltMesh } from "../../lib/models/timingbelt"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
const modelString = "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm"
test("timingbelt full canonical model string four views", async () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "timingbelt") throw new Error("Wrong family")
  const { fn, ...props } = model,
    d = getTimingBeltDimensions(props)
  const target: [number, number, number] = [
    d.length / 2,
    0,
    (d.toothTipZ + d.backZ) / 2,
  ]
  const span = d.length * 0.9
  const eye = (offset: [number, number, number]): [number, number, number] =>
    offset.map((n, i) => n + target[i]!) as [number, number, number]
  const png = await renderModelSnapshot({
    mesh: createTimingBeltMesh(props),
    title: "TimingBelt / generic transmission",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "open ends and actual trapezoidal teeth",
        eye: eye([span, -span, span * 0.8]),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "integer pitch-line length and centered width",
        eye: eye([0, 0, span * 2]),
        target,
        span: d.length * 0.8,
      },
      {
        name: "FRONT",
        detail: "flat tooth tips and straight 40-degree flanks",
        eye: eye([0, -span * 2, 0]),
        target,
        span: d.length * 0.8,
      },
      {
        name: "SIDE",
        detail: "2.2mm basic T5 section and tensile datum",
        eye: eye([span * 2, 0, 0]),
        target,
        span: Math.max(props.width, d.totalThickness) * 1.8,
      },
    ],
    footer: "Open straight T5 basic section; no endless loop or cords implied",
  })
  await expectPngSnapshot(png, import.meta.path)
})
