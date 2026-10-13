import jscad from "@jscad/modeling"
import {
  needleValveModelPropsSchema,
  type NeedleValveModelPropsInput,
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
export function createNeedleValveGeom(input: NeedleValveModelPropsInput = {}) {
  const p = needleValveModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    box({ size: [p.bodyLength, p.bodyWidth, p.bodyHeight] }),
    solidX(p.portDiameter, p.bodyLength + p.portLength * 2),
    ...[-1, 1].map((side) =>
      hexX(
        p.portDiameter * 1.15,
        p.portLength * 0.75,
        (side * (p.bodyLength + p.portLength)) / 2,
      ),
    ),
    solidZ(
      p.portDiameter * 0.6,
      p.stemHeight,
      0,
      0,
      p.bodyHeight / 2 + p.stemHeight / 2 - e,
    ),
    solidZ(
      p.wheelDiameter,
      p.wheelThickness,
      0,
      0,
      p.bodyHeight / 2 + p.stemHeight,
    ),
  )
  // Crossed through ports and a raised handwheel; a nominal open flow envelope.
  return subtract(
    shell,
    solidX(p.boreDiameter, p.bodyLength + p.portLength * 2 + e),
    ...Array.from({ length: 6 }, (_, i) => {
      const angle = (2 * Math.PI * i) / 6
      return solidZ(
        p.wheelDiameter * 0.17,
        p.wheelThickness + e,
        p.wheelDiameter * 0.29 * Math.cos(angle),
        p.wheelDiameter * 0.29 * Math.sin(angle),
        p.bodyHeight / 2 + p.stemHeight,
      )
    }),
  )
}
export function createNeedleValveMesh(input: NeedleValveModelPropsInput = {}) {
  return geom3ToIndexedMesh(createNeedleValveGeom(input))
}
