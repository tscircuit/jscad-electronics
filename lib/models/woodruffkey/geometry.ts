import jscad from "@jscad/modeling"
import {
  woodruffKeyModelPropsSchema,
  type WoodruffKeyModelPropsInput,
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
/** Circular segment key in XZ, thickness along Y, flat top at Z=height, bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createWoodruffKeyGeom(input: WoodruffKeyModelPropsInput = {}) {
  const p = woodruffKeyModelPropsSchema.parse(input)
  return jscad.booleans.intersect(
    cyl(p.diameter, p.thickness, [0, 0, p.diameter / 2], "y", 96),
    box([p.diameter + 2, p.thickness, p.height], [0, 0, p.height / 2]),
  )
}
export function createWoodruffKeyMesh(input: WoodruffKeyModelPropsInput = {}) {
  return geom3ToIndexedMesh(createWoodruffKeyGeom(input))
}
