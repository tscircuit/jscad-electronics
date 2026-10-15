import jscad from "@jscad/modeling"
import {
  roundBarModelPropsSchema,
  type RoundBarModelPropsInput,
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
/** Round stock along +Z with equal end chamfers; bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createRoundBarGeom(input: RoundBarModelPropsInput = {}) {
  const p = roundBarModelPropsSchema.parse(input)
  const taper = (bottom: boolean) =>
    jscad.transforms.translate(
      [0, 0, bottom ? p.chamfer / 2 : p.length - p.chamfer / 2],
      jscad.primitives.cylinderElliptic({
        height: p.chamfer,
        startRadius: bottom
          ? [p.diameter / 2 - p.chamfer, p.diameter / 2 - p.chamfer]
          : [p.diameter / 2, p.diameter / 2],
        endRadius: bottom
          ? [p.diameter / 2, p.diameter / 2]
          : [p.diameter / 2 - p.chamfer, p.diameter / 2 - p.chamfer],
        segments: 64,
      }),
    )
  return join(
    cyl(p.diameter, p.length - 2 * p.chamfer, [0, 0, p.length / 2], "z", 64),
    taper(true),
    taper(false),
  )
}
export function createRoundBarMesh(input: RoundBarModelPropsInput = {}) {
  return geom3ToIndexedMesh(createRoundBarGeom(input))
}
