import jscad from "@jscad/modeling"
import {
  rubberBumperModelPropsSchema,
  type RubberBumperModelPropsInput,
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
/** Cylindrical bumper with axial through bore and top counterbore, axis Z. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createRubberBumperGeom(
  input: RubberBumperModelPropsInput = {},
) {
  const p = rubberBumperModelPropsSchema.parse(input)
  return cut(
    cyl(p.diameter, p.height, [0, 0, p.height / 2]),
    cyl(p.holeDiameter, p.height + 2, [0, 0, p.height / 2]),
    cyl(p.counterboreDiameter, p.counterboreDepth + 1, [
      0,
      0,
      p.height - p.counterboreDepth / 2 + 0.5,
    ]),
  )
}
export function createRubberBumperMesh(
  input: RubberBumperModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createRubberBumperGeom(input))
}
