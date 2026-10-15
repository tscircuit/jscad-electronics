import jscad from "@jscad/modeling"
import {
  hoseBarbModelPropsSchema,
  type HoseBarbModelPropsInput,
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
export function createHoseBarbGeom(input: HoseBarbModelPropsInput = {}) {
  const p = hoseBarbModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const start = p.length / 2 - p.barbLength
  const shell = union(
    solidX(p.outerDiameter, p.length - p.barbLength, -p.barbLength / 2),
    hexX(
      p.hexAcrossFlats,
      (p.length - p.barbLength) * 0.4,
      start - (p.length - p.barbLength) * 0.2,
    ),
    solidX(p.barbDiameter * 0.8, p.barbLength, p.length / 2 - p.barbLength / 2),
    ...Array.from({ length: Math.floor(p.barbLength / p.barbPitch) }, (_, i) =>
      taperX(
        p.barbDiameter,
        p.barbDiameter * 0.8,
        p.barbPitch * 0.8,
        start + p.barbPitch * (i + 0.5),
      ),
    ),
  )
  return subtract(shell, solidX(p.boreDiameter, p.length + e))
}
export function createHoseBarbMesh(input: HoseBarbModelPropsInput = {}) {
  return geom3ToIndexedMesh(createHoseBarbGeom(input))
}
