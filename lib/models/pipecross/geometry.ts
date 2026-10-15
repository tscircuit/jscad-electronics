import jscad from "@jscad/modeling"
import {
  pipeCrossModelPropsSchema,
  type PipeCrossModelPropsInput,
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
export function createPipeCrossGeom(input: PipeCrossModelPropsInput = {}) {
  const p = pipeCrossModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.span),
    solidY(p.outerDiameter, p.span),
    ...[-1, 1].flatMap((side) => [
      solidX(
        p.socketDiameter,
        p.socketLength,
        (side * (p.span - p.socketLength)) / 2,
      ),
      solidY(
        p.socketDiameter,
        p.socketLength,
        0,
        (side * (p.span - p.socketLength)) / 2,
      ),
    ]),
  )
  return subtract(
    shell,
    solidX(p.boreDiameter, p.span + e),
    solidY(p.boreDiameter, p.span + e),
  )
}
export function createPipeCrossMesh(input: PipeCrossModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeCrossGeom(input))
}
