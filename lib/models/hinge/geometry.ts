import jscad from "@jscad/modeling"
import {
  hingeModelPropsSchema,
  type HingeModelPropsInput,
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
/** Flat open butt hinge, leaves in XY, hinge axis along Y; bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createHingeGeom(input: HingeModelPropsInput = {}) {
  const p = hingeModelPropsSchema.parse(input)
  const leaves = box(
    [p.width, p.length, p.leafThickness],
    [0, 0, p.leafThickness / 2],
  )
  const holes = [-1, 1].flatMap((s) =>
    [-1, 1].map((t) =>
      cyl(p.holeDiameter, p.barrelDiameter + 2, [
        s * p.width * 0.32,
        t * p.length * 0.3,
        p.barrelDiameter / 2,
      ]),
    ),
  )
  const leafSolid = cut(
    leaves,
    ...holes,
    box(
      [p.barrelDiameter * 0.65, p.length + 2, p.barrelDiameter],
      [0, 0, p.barrelDiameter / 2],
    ),
  )
  const knuckles = Array.from({ length: 5 }, (_, i) =>
    cyl(
      p.barrelDiameter,
      (p.length / 5) * 0.94,
      [0, -p.length / 2 + ((i + 0.5) * p.length) / 5, p.barrelDiameter / 2],
      "y",
    ),
  )
  const bridges = Array.from({ length: 5 }, (_, i) =>
    box(
      [p.barrelDiameter, (p.length / 5) * 0.94, p.leafThickness],
      [
        i % 2 ? p.barrelDiameter * 0.25 : -p.barrelDiameter * 0.25,
        -p.length / 2 + ((i + 0.5) * p.length) / 5,
        p.leafThickness / 2,
      ],
    ),
  )
  // The pin is installed; its visible end faces are smaller than the barrels.
  return join(
    leafSolid,
    ...knuckles,
    ...bridges,
    cyl(p.pinDiameter, p.length + 2, [0, 0, p.barrelDiameter / 2], "y"),
  )
}
export function createHingeMesh(input: HingeModelPropsInput = {}) {
  return geom3ToIndexedMesh(createHingeGeom(input))
}
