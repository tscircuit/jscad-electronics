import jscad from "@jscad/modeling"
import {
  pushConnectFittingModelPropsSchema,
  type PushConnectFittingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  union,
  subtract,
  box,
  sphere,
  solidX,
  solidY,
  solidZ,
  hexX,
  taperX,
  overrun,
} from "../../mechanical/plumbing-shapes"
/** Nominal envelope centered on its flow axis. Threads use smooth envelopes. */
export function createPushConnectFittingGeom(
  input: PushConnectFittingModelPropsInput = {},
) {
  const p = pushConnectFittingModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const collarX = (p.length - p.colletLength) / 2
  const shell = union(
    solidX(p.outerDiameter, p.length - p.colletLength, -p.colletLength / 2),
    hexX(p.hexAcrossFlats, p.length * 0.22, -p.length * 0.3),
    solidX(p.colletDiameter, p.colletLength, collarX),
  )
  const slots = Array.from({ length: 4 }, (_, i) => {
    const angle = (Math.PI * i) / 2
    return jscad.transforms.rotateX(
      angle,
      box({
        size: [
          p.colletLength * 0.45 + e,
          p.colletDiameter * 0.07,
          p.colletDiameter,
        ],
        center: [p.length / 2 - p.colletLength * 0.22, 0, 0],
      }),
    )
  })
  return subtract(
    shell,
    solidX(p.boreDiameter, p.length + e),
    solidX(p.tubeDiameter, p.length * 0.45 + e, p.length * 0.275),
    ...slots,
  )
}
export function createPushConnectFittingMesh(
  input: PushConnectFittingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPushConnectFittingGeom(input))
}
