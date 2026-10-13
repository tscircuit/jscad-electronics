import jscad from "@jscad/modeling"
import {
  pipeTeeModelPropsSchema,
  type PipeTeeModelPropsInput,
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
export function createPipeTeeGeom(input: PipeTeeModelPropsInput = {}) {
  const p = pipeTeeModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.length),
    solidY(
      p.outerDiameter,
      p.branchLength + p.outerDiameter / 2,
      0,
      (p.branchLength - p.outerDiameter / 2) / 2,
    ),
    solidX(
      p.socketDiameter,
      p.socketLength,
      -p.length / 2 + p.socketLength / 2,
    ),
    solidX(p.socketDiameter, p.socketLength, p.length / 2 - p.socketLength / 2),
    solidY(
      p.socketDiameter,
      p.socketLength,
      0,
      p.branchLength - p.socketLength / 2,
    ),
  )
  return subtract(
    shell,
    solidX(p.boreDiameter, p.length + e),
    solidY(p.boreDiameter, p.branchLength + e, 0, p.branchLength / 2),
  )
}
export function createPipeTeeMesh(input: PipeTeeModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeTeeGeom(input))
}
