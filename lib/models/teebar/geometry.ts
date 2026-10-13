import jscad from "@jscad/modeling"
import {
  teeBarModelPropsSchema,
  type TeeBarModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  machineBox as box,
  machineCylinder as cyl,
  machineRod as rod,
  machineUnion as join,
  machineSubtract as cut,
  machineRotateZ as turn,
} from "../../mechanical/machine-hardware-primitives"
/** T-section stock, centered XY envelope, flange at maximum Y, length +Z. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createTeeBarGeom(input: TeeBarModelPropsInput = {}) {
  const p = teeBarModelPropsSchema.parse(input)
  return join(
    box(
      [p.width, p.flangeThickness, p.length],
      [0, p.height / 2 - p.flangeThickness / 2, p.length / 2],
    ),
    box([p.webThickness, p.height, p.length], [0, 0, p.length / 2]),
  )
}
export function createTeeBarMesh(input: TeeBarModelPropsInput = {}) {
  return geom3ToIndexedMesh(createTeeBarGeom(input))
}
