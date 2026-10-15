import jscad from "@jscad/modeling"
import {
  rigidPipeModelPropsSchema,
  type RigidPipeModelPropsInput,
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
export function createRigidPipeGeom(input: RigidPipeModelPropsInput = {}) {
  const p = rigidPipeModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  return subtract(
    solidX(p.outerDiameter, p.length),
    solidX(p.boreDiameter, p.length + e),
  )
}
export function createRigidPipeMesh(input: RigidPipeModelPropsInput = {}) {
  return geom3ToIndexedMesh(createRigidPipeGeom(input))
}
