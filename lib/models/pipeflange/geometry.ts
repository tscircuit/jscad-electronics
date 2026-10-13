import jscad from "@jscad/modeling"
import {
  pipeFlangeModelPropsSchema,
  type PipeFlangeModelPropsInput,
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
export function createPipeFlangeGeom(input: PipeFlangeModelPropsInput = {}) {
  const p = pipeFlangeModelPropsSchema.parse(input)
  const e = overrun(
    Math.max(
      ...Object.entries(p)
        .filter(([key]) => !key.endsWith("Count"))
        .map(([, value]) => value),
    ),
  )
  const shell = union(
    solidX(p.flangeDiameter, p.flangeThickness),
    solidX(p.hubDiameter, p.hubLength, (p.flangeThickness + p.hubLength) / 2),
  )
  const holes = Array.from({ length: p.boltCount }, (_, i) => {
    const angle = (Math.PI * 2 * i) / p.boltCount
    return solidX(
      p.boltHoleDiameter,
      p.flangeThickness + e,
      0,
      (p.boltCircleDiameter / 2) * Math.cos(angle),
      (p.boltCircleDiameter / 2) * Math.sin(angle),
    )
  })
  return subtract(
    shell,
    solidX(
      p.boreDiameter,
      p.flangeThickness + p.hubLength + e,
      p.hubLength / 2,
    ),
    ...holes,
  )
}
export function createPipeFlangeMesh(input: PipeFlangeModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPipeFlangeGeom(input))
}
