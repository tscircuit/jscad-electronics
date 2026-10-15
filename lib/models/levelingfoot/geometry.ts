import jscad from "@jscad/modeling"
import {
  levelingFootModelPropsSchema,
  type LevelingFootModelPropsInput,
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
/** Leveling foot with puck, nominal smooth threaded-stem envelope and hex lock nut, axis Z. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createLevelingFootGeom(
  input: LevelingFootModelPropsInput = {},
) {
  const p = levelingFootModelPropsSchema.parse(input)
  return join(
    cyl(p.baseDiameter, p.baseHeight, [0, 0, p.baseHeight / 2]),
    cyl(p.stemDiameter, p.stemLength, [0, 0, p.baseHeight + p.stemLength / 2]),
    cyl(
      p.hexDiameter,
      p.hexHeight,
      [0, 0, p.baseHeight + p.hexHeight / 2],
      "z",
      6,
    ),
  )
}
export function createLevelingFootMesh(
  input: LevelingFootModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createLevelingFootGeom(input))
}
