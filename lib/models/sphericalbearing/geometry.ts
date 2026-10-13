import jscad from "@jscad/modeling"
import {
  sphericalBearingModelPropsSchema,
  type SphericalBearingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionBox,
} from "../../mechanical/motion-geometry-utils"
const { primitives } = jscad
const { union, subtract, intersect } = jscad.booleans
/** Spherical plain bearing assembly: cylindrical outer race with spherical pocket and truncated spherical inner ring with an axial bore. Axis Z, bottom Z=0. Outer race is recessed to 72% of inner-ring width to expose the spherical shoulders. Small nominal spherical clearance; articulation and tolerances are not modeled. */
export function createSphericalBearingGeom(
  input: SphericalBearingModelPropsInput = {},
) {
  const p = sphericalBearingModelPropsSchema.parse(input)

  const middle = [0, 0, p.width / 2] as [number, number, number]
  const pocket = primitives.sphere({
    radius: p.ballDiameter / 2 + 0.05,
    segments: 32,
    center: middle,
  })
  const outer = subtract(
    motionCylinder(p.outerDiameter, p.width * 0.72, p.width * 0.14),
    pocket,
    motionCylinder(p.boreDiameter, p.width + 0.4, -0.2),
  )
  const ball = intersect(
    primitives.sphere({
      radius: p.ballDiameter / 2,
      segments: 32,
      center: middle,
    }),
    motionBox(p.ballDiameter, p.ballDiameter, p.width, middle),
  )
  const inner = subtract(
    ball,
    motionCylinder(p.boreDiameter, p.width + 0.4, -0.2),
  )
  return union(outer, inner)
}
export function createSphericalBearingMesh(
  input: SphericalBearingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createSphericalBearingGeom(input))
}
