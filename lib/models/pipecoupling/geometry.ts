import jscad from "@jscad/modeling"
import {
  pipeCouplingModelPropsSchema,
  type PipeCouplingModelPropsInput,
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
export function createPipeCouplingGeom(
  input: PipeCouplingModelPropsInput = {},
) {
  const p = pipeCouplingModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  return subtract(
    solidX(p.outerDiameter, p.length),
    solidX(p.boreDiameter, p.length + e),
    solidX(
      p.socketDiameter,
      p.socketDepth + e,
      (-p.length + p.socketDepth) / 2,
    ),
    solidX(p.socketDiameter, p.socketDepth + e, (p.length - p.socketDepth) / 2),
  )
}
export function createPipeCouplingMesh(
  input: PipeCouplingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPipeCouplingGeom(input))
}
