import jscad from "@jscad/modeling"
import {
  handwheelModelPropsSchema,
  type HandwheelModelPropsInput,
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
/** Flat-rim spoked handwheel with axial bore, rotating axis Z. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createHandwheelGeom(input: HandwheelModelPropsInput = {}) {
  const p = handwheelModelPropsSchema.parse(input)
  const rim = cut(
    cyl(p.outerDiameter, p.rimWidth, [0, 0, p.rimWidth / 2]),
    cyl(p.outerDiameter - 2 * p.rimWidth, p.rimWidth + 2, [
      0,
      0,
      p.rimWidth / 2,
    ]),
  )
  const spokes = Array.from({ length: p.spokes }, (_, i) =>
    turn(
      (i * 2 * Math.PI) / p.spokes,
      box(
        [p.outerDiameter / 2, p.rimWidth * 0.65, p.rimWidth * 0.6],
        [p.outerDiameter / 4, 0, p.rimWidth / 2],
      ),
    ),
  )
  return cut(
    join(
      rim,
      ...spokes,
      cyl(p.hubDiameter, p.hubHeight, [0, 0, p.hubHeight / 2]),
    ),
    cyl(p.boreDiameter, p.hubHeight + 2, [0, 0, p.hubHeight / 2]),
  )
}
export function createHandwheelMesh(input: HandwheelModelPropsInput = {}) {
  return geom3ToIndexedMesh(createHandwheelGeom(input))
}
