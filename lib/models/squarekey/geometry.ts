import jscad from "@jscad/modeling"
import {
  squareKeyModelPropsSchema,
  type SquareKeyModelPropsInput,
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
/** Parallel shaft key, length X, width Y, height Z; clipped plan corners, bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createSquareKeyGeom(input: SquareKeyModelPropsInput = {}) {
  const p = squareKeyModelPropsSchema.parse(input)
  const x = p.length / 2,
    y = p.width / 2,
    c = p.chamfer
  const points: [number, number][] = [
    [-x + c, -y],
    [x - c, -y],
    [x, -y + c],
    [x, y - c],
    [x - c, y],
    [-x + c, y],
    [-x, y - c],
    [-x, -y + c],
  ]
  return jscad.extrusions.extrudeLinear(
    { height: p.height },
    jscad.primitives.polygon({ points }),
  )
}
export function createSquareKeyMesh(input: SquareKeyModelPropsInput = {}) {
  return geom3ToIndexedMesh(createSquareKeyGeom(input))
}
