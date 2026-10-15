import jscad from "@jscad/modeling"
import {
  iBeamModelPropsSchema,
  type IBeamModelPropsInput,
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
/** I-section stock, centered XY cross section, length +Z from Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createIBeamGeom(input: IBeamModelPropsInput = {}) {
  const p = iBeamModelPropsSchema.parse(input)
  return join(
    box(
      [p.width, p.flangeThickness, p.length],
      [0, -p.height / 2 + p.flangeThickness / 2, p.length / 2],
    ),
    box(
      [p.width, p.flangeThickness, p.length],
      [0, p.height / 2 - p.flangeThickness / 2, p.length / 2],
    ),
    box([p.webThickness, p.height, p.length], [0, 0, p.length / 2]),
  )
}
export function createIBeamMesh(input: IBeamModelPropsInput = {}) {
  return geom3ToIndexedMesh(createIBeamGeom(input))
}
