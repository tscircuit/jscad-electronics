import jscad from "@jscad/modeling"
import {
  rodEndModelPropsSchema,
  type RodEndModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
  motionBox,
  motionCylinderY,
} from "../../mechanical/motion-geometry-utils"
const { primitives } = jscad
const { union, subtract, intersect } = jscad.booleans
/** Rod-end eye with a curved spherical inner insert and smooth male-stem envelope pointing toward -Y. Eye axis Z, bottom Z=0. Thread major diameter only, no threads, articulation limit or load rating. */
export function createRodEndGeom(input: RodEndModelPropsInput = {}) {
  const p = rodEndModelPropsSchema.parse(input)

  const pocketDiameter = p.headDiameter * 0.7
  const housing = motionRing(p.headDiameter, pocketDiameter, p.headWidth)
  const spherical = intersect(
    primitives.sphere({
      radius: pocketDiameter / 2 + 0.02,
      segments: 32,
      center: [0, 0, p.headWidth / 2],
    }),
    motionBox(p.headDiameter, p.headDiameter, p.headWidth, [
      0,
      0,
      p.headWidth / 2,
    ]),
  )
  const insert = subtract(
    spherical,
    motionCylinder(p.boreDiameter, p.headWidth + 0.4, -0.2),
  )
  const stem = motionCylinderY(
    p.stemDiameter,
    p.stemLength + p.headDiameter * 0.12,
    [
      0,
      -p.headDiameter / 2 - p.stemLength / 2 + p.headDiameter * 0.06,
      p.headWidth / 2,
    ],
  )
  return union(housing, insert, stem)
}
export function createRodEndMesh(input: RodEndModelPropsInput = {}) {
  return geom3ToIndexedMesh(createRodEndGeom(input))
}
