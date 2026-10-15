import jscad from "@jscad/modeling"
import {
  pipeElbowModelPropsSchema,
  type PipeElbowModelPropsInput,
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
/** Cast corner envelope with a mitered internal passage joining +X/+Y ports. */
export function createPipeElbowGeom(input: PipeElbowModelPropsInput = {}) {
  const p = pipeElbowModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.legLength, p.legLength / 2),
    solidY(p.outerDiameter, p.legLength, 0, p.legLength / 2),
    sphere({ radius: p.outerDiameter / 2, segments: 24 }),
    solidX(p.socketDiameter, p.socketLength, p.legLength - p.socketLength / 2),
    solidY(
      p.socketDiameter,
      p.socketLength,
      0,
      p.legLength - p.socketLength / 2,
    ),
  )
  // Overlapping perpendicular bores form a mitered internal junction. Starting
  // both cutters inside the cast corner removes tangent sphere-to-cylinder
  // seams while retaining positive material behind the elbow's closed heel.
  const junctionOverlap = Math.min(
    p.boreDiameter / 4,
    (p.outerDiameter - p.boreDiameter) / 4,
  )
  const boreLength = p.legLength + junctionOverlap + e
  const boreCenter = (p.legLength - junctionOverlap) / 2
  return subtract(
    shell,
    solidX(p.boreDiameter, boreLength, boreCenter),
    solidY(p.boreDiameter, boreLength, 0, boreCenter),
  )
}
export function createPipeElbowMesh(input: PipeElbowModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeElbowGeom(input))
}
