import { mp, getHexNutDimensions } from "@tscircuit/modelprinter"
import { createHexNutMesh } from "../../lib/models/hexnut"
import { renderModelSnapshot } from "./render-model-snapshot"

export async function renderHexNutSnapshot(modelString: string, title: string) {
  const model = mp.string(modelString).json()
  if (model.fn !== "hexnut") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const d = getHexNutDimensions(props)
  const target = [0, 0, d.height / 2] as const
  const scale = d.acrossFlats
  return renderModelSnapshot({
    mesh: createHexNutMesh(props, { radialSegments: 48, segmentsPerPitch: 16 }),
    title,
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "COARSE INTERNAL THREAD / TWO CHAMFERED ENTRANCES",
        eye: [scale * 1.5, -scale * 2.2, scale * 1.8],
        target,
        span: scale * 1.4,
      },
      {
        name: "TOP",
        detail: "THROUGH BORE / HEXAGONAL ENVELOPE",
        eye: [0, 0, scale * 3],
        target,
        span: scale * 1.4,
      },
      {
        name: "FRONT",
        detail: `${d.height.toFixed(3)} mm THICKNESS`,
        eye: [0, -scale * 3, d.height / 2],
        target,
        span: scale * 1.4,
      },
      {
        name: "SIDE",
        detail: `${d.acrossFlats.toFixed(3)} mm ACROSS FLATS`,
        eye: [scale * 3, 0, d.height / 2],
        target,
        span: scale * 1.4,
      },
    ],
    footer:
      "FOUR VIEWS / DIMENSIONS IN mm / MODELPRINTER CONTRACT / UNTOLERANCED VISUAL MODEL",
  })
}
