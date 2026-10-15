import jscad from "@jscad/modeling"
import {
  starKnobModelPropsSchema,
  type StarKnobModelPropsInput,
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
/** Lobed star knob with bottom hub and axial through bore, axis Z. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createStarKnobGeom(input: StarKnobModelPropsInput = {}) {
  const p = starKnobModelPropsSchema.parse(input)
  const knobs = Array.from({ length: p.lobes }, (_, i) => {
    const angle = (i * 2 * Math.PI) / p.lobes
    return cyl(p.diameter * 0.36, p.height, [
      p.diameter * 0.31 * Math.cos(angle),
      p.diameter * 0.31 * Math.sin(angle),
      p.hubHeight + p.height / 2,
    ])
  })
  return cut(
    join(
      cyl(p.hubDiameter, p.hubHeight, [0, 0, p.hubHeight / 2]),
      cyl(p.diameter * 0.66, p.height, [0, 0, p.hubHeight + p.height / 2]),
      ...knobs,
    ),
    cyl(p.boreDiameter, p.height + p.hubHeight + 2, [
      0,
      0,
      (p.height + p.hubHeight) / 2,
    ]),
  )
}
export function createStarKnobMesh(input: StarKnobModelPropsInput = {}) {
  return geom3ToIndexedMesh(createStarKnobGeom(input))
}
