import jscad from "@jscad/modeling"
import {
  barrelHingeModelPropsSchema,
  type BarrelHingeModelPropsInput,
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
/** Vertical barrel hinge, axis Z, opposed mounting tabs, bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createBarrelHingeGeom(input: BarrelHingeModelPropsInput = {}) {
  const p = barrelHingeModelPropsSchema.parse(input)
  const barrels = [
    cyl(p.barrelDiameter, p.height * 0.48, [0, 0, p.height * 0.24]),
    cyl(p.barrelDiameter, p.height * 0.48, [0, 0, p.height * 0.76]),
  ]
  const tabs = [-1, 1].map((s) => {
    const z = s < 0 ? p.height * 0.24 : p.height * 0.76
    return cut(
      box(
        [p.leafWidth + p.barrelDiameter / 2, p.leafThickness, p.height * 0.42],
        [(s * p.leafWidth) / 2, 0, z],
      ),
      cyl(
        p.holeDiameter,
        p.leafThickness + 2,
        [s * p.leafWidth * 0.6, 0, z],
        "y",
      ),
    )
  })
  return join(
    ...barrels,
    ...tabs,
    cyl(p.pinDiameter, p.height, [0, 0, p.height / 2]),
  )
}
export function createBarrelHingeMesh(input: BarrelHingeModelPropsInput = {}) {
  return geom3ToIndexedMesh(createBarrelHingeGeom(input))
}
