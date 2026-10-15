import jscad from "@jscad/modeling"
import {
  pipeCapModelPropsSchema,
  type PipeCapModelPropsInput,
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
export function createPipeCapGeom(input: PipeCapModelPropsInput = {}) {
  const p = pipeCapModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.length),
    hexX(p.hexAcrossFlats, p.floorThickness, (p.length - p.floorThickness) / 2),
  )
  return subtract(
    shell,
    solidX(
      p.socketDiameter,
      p.length - p.floorThickness + e,
      -p.floorThickness / 2 - e / 2,
    ),
  )
}
export function createPipeCapMesh(input: PipeCapModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeCapGeom(input))
}
