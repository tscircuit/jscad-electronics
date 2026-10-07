import { mp } from "@tscircuit/modelprinter"
import { createBallBearingMesh } from "../../lib/models/ballbearing"
import {
  ballBearingFaceCases,
  type BallBearingFaceState,
} from "./ballbearing-face-cases"
import { expectPngSnapshot } from "./expect-png-snapshot"
import { renderModelSnapshot } from "./render-model-snapshot"

export async function assertBallBearingSnapshot(
  file: string,
  top: BallBearingFaceState,
  bottom: BallBearingFaceState,
) {
  const example = ballBearingFaceCases.find(
    (item) => item.top === top && item.bottom === bottom,
  )!
  const modelString = example.modelString
  const model = mp.string(modelString).json()
  if (model.fn !== "ballbearing") throw new Error("Expected ballbearing")
  const { fn, ...props } = model
  const scale = props.outerDiameter / 22
  const mid = props.width / 2
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createBallBearingMesh(props),
      title: "RADIAL BALL BEARING / INDEPENDENT FACES",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: `BOTTOM ${bottom.toUpperCase()} / Z=0 FACE`,
          eye: [35 * scale, -45 * scale, mid - 26.5 * scale],
          target: [0, 0, mid],
          span: 29 * scale,
        },
        {
          name: "TOP",
          detail: `TOP ${top.toUpperCase()} / Z=WIDTH FACE`,
          eye: [0, 0, mid + 61.5 * scale],
          target: [0, 0, mid],
          span: 32 * scale,
        },
        {
          name: "FRONT",
          detail: `${props.innerDiameter}mm BORE / ${props.outerDiameter}mm OD / ${props.width}mm WIDTH`,
          eye: [0, -65 * scale, mid],
          target: [0, 0, mid],
          span: 29 * scale,
        },
        {
          name: "SIDE",
          detail: `TOP ${top.toUpperCase()} / BOTTOM ${bottom.toUpperCase()}`,
          eye: [65 * scale, 0, mid],
          target: [0, 0, mid],
          span: 29 * scale,
        },
      ],
      footer:
        "POPPYGL / TOP=+Z FACE / BOTTOM=Z0 FACE / UNTOLERANCED NOMINAL mm / TRUE THROUGH BORE",
    }),
    file,
  )
}
