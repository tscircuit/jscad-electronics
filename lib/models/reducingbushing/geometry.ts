import jscad from "@jscad/modeling"
import {
  reducingBushingModelPropsSchema,
  type ReducingBushingModelPropsInput,
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
export function createReducingBushingGeom(
  input: ReducingBushingModelPropsInput = {},
) {
  const p = reducingBushingModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.length),
    hexX(p.hexAcrossFlats, p.hexLength, (-p.length + p.hexLength) / 2),
  )
  return subtract(
    shell,
    taperX(p.largeBoreDiameter, p.smallBoreDiameter, p.length + e),
  )
}
export function createReducingBushingMesh(
  input: ReducingBushingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createReducingBushingGeom(input))
}
