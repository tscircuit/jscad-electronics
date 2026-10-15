import jscad from "@jscad/modeling"
import {
  casterModelPropsSchema,
  type CasterModelPropsInput,
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
/** Nominal fixed caster assembly: rolling axis Y, plate in XY, wheel contact Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createCasterGeom(input: CasterModelPropsInput = {}) {
  const p = casterModelPropsSchema.parse(input)
  const r = p.wheelDiameter / 2,
    top = p.overallHeight - p.plateThickness
  const wheel = cut(
    cyl(p.wheelDiameter, p.wheelWidth, [0, 0, r], "y"),
    cyl(p.axleDiameter, p.wheelWidth + 2, [0, 0, r], "y"),
  )
  const forks = [-1, 1].map((s) =>
    box(
      [p.wheelDiameter * 0.4, p.forkThickness, top - r + p.axleDiameter],
      [
        0,
        s * (p.wheelWidth / 2 + 1 + p.forkThickness / 2),
        (top + r - p.axleDiameter) / 2,
      ],
    ),
  )
  const plate = cut(
    box(
      [p.plateLength, p.plateWidth, p.plateThickness],
      [0, 0, p.overallHeight - p.plateThickness / 2],
    ),
    ...[-1, 1].flatMap((s) =>
      [-1, 1].map((t) =>
        cyl(p.holeDiameter, p.plateThickness + 2, [
          s * p.plateLength * 0.35,
          t * p.plateWidth * 0.35,
          p.overallHeight - p.plateThickness / 2,
        ]),
      ),
    ),
  )
  return join(
    wheel,
    ...forks,
    plate,
    cyl(p.axleDiameter, p.wheelWidth + 2 * p.forkThickness + 4, [0, 0, r], "y"),
  )
}
export function createCasterMesh(input: CasterModelPropsInput = {}) {
  return geom3ToIndexedMesh(createCasterGeom(input))
}
