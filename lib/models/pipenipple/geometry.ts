import jscad from "@jscad/modeling"
import {
  pipeNippleModelPropsSchema,
  type PipeNippleModelPropsInput,
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
export function createPipeNippleGeom(input: PipeNippleModelPropsInput = {}) {
  const p = pipeNippleModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.length),
    solidX(p.shoulderDiameter, p.length - p.threadLength * 2),
  )
  return subtract(shell, solidX(p.boreDiameter, p.length + e))
}
export function createPipeNippleMesh(input: PipeNippleModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeNippleGeom(input))
}
