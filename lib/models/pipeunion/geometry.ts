import jscad from "@jscad/modeling"
import {
  pipeUnionModelPropsSchema,
  type PipeUnionModelPropsInput,
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
export function createPipeUnionGeom(input: PipeUnionModelPropsInput = {}) {
  const p = pipeUnionModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.endDiameter, p.length),
    solidX(p.outerDiameter, p.nutLength * 1.25),
    hexX(p.nutAcrossFlats, p.nutLength),
  )
  // Two narrow annular seams make the captive swivel nut legible.
  const grooves = [-1, 1].map((side) =>
    subtract(
      solidX(
        p.nutAcrossFlats * 1.3,
        p.nutLength * 0.025,
        side * p.nutLength * 0.43,
      ),
      solidX(p.outerDiameter, p.nutLength * 0.03, side * p.nutLength * 0.43),
    ),
  )
  return subtract(shell, solidX(p.boreDiameter, p.length + e), ...grooves)
}
export function createPipeUnionMesh(input: PipeUnionModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeUnionGeom(input))
}
