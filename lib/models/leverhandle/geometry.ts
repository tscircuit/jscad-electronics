import jscad from "@jscad/modeling"
import {
  leverHandleModelPropsSchema,
  type LeverHandleModelPropsInput,
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
/** Lever handle extending along +X from bored hub; bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createLeverHandleGeom(input: LeverHandleModelPropsInput = {}) {
  const p = leverHandleModelPropsSchema.parse(input)
  return cut(
    join(
      cyl(p.hubDiameter, p.hubHeight, [0, 0, p.hubHeight / 2]),
      box(
        [p.length - p.width / 2, p.width, p.height],
        [(p.length - p.width / 2) / 2, 0, p.hubHeight - p.height / 2],
      ),
      cyl(p.width, p.height, [
        p.length - p.width / 2,
        0,
        p.hubHeight - p.height / 2,
      ]),
    ),
    cyl(p.boreDiameter, p.hubHeight + 2, [0, 0, p.hubHeight / 2]),
  )
}
export function createLeverHandleMesh(input: LeverHandleModelPropsInput = {}) {
  return geom3ToIndexedMesh(createLeverHandleGeom(input))
}
