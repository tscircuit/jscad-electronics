import { test } from "bun:test"
import { mp, getBeltIdlerDimensions } from "@tscircuit/modelprinter"
import { createBeltIdlerMesh } from "../../lib/models/beltidler"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
const modelString =
  "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm"
test("beltidler full canonical model string four views", async () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "beltidler") throw new Error("Wrong family")
  const { fn, ...props } = model,
    d = getBeltIdlerDimensions(props)
  const target: [number, number, number] = [0, 0, d.faceWidth / 2]
  const span = Math.max(d.flangeDiameter, d.totalWidth) * 1.4
  const eye = (offset: [number, number, number]): [number, number, number] =>
    offset.map((n, i) => n + target[i]!) as [number, number, number]
  const png = await renderModelSnapshot({
    mesh: createBeltIdlerMesh(props),
    title: "BeltIdler / generic transmission",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "through bore and complete flange profile",
        eye: eye([span, -span, span * 0.8]),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "smooth circular contact surface",
        eye: eye([0, 0, span * 2]),
        target,
        span,
      },
      {
        name: "FRONT",
        detail: "positive belt clearance between two flanges",
        eye: eye([0, -span * 2, 0]),
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "face and flange end datums",
        eye: eye([span * 2, 0, 0]),
        target,
        span,
      },
    ],
    footer: "Generic smooth-back roller; explicit bore and flange clearances",
  })
  await expectPngSnapshot(png, import.meta.path)
})
