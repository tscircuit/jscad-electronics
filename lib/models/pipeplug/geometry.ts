import jscad from "@jscad/modeling"
import {
  pipePlugModelPropsSchema,
  type PipePlugModelPropsInput,
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
export function createPipePlugGeom(input: PipePlugModelPropsInput = {}) {
  const p = pipePlugModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  return union(
    solidX(p.diameter, p.length),
    hexX(p.headAcrossFlats, p.headHeight, (p.length + p.headHeight) / 2),
  )
}
export function createPipePlugMesh(input: PipePlugModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipePlugGeom(input))
}
