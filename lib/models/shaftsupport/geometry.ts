import jscad from "@jscad/modeling"
import {
  shaftSupportModelPropsSchema,
  type ShaftSupportModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionBox,
  motionCylinderY,
  motionCylinderX,
} from "../../mechanical/motion-geometry-utils"
const { union, subtract } = jscad.booleans
const { translate } = jscad.transforms
/** Split shaft support with a horizontal Y shaft bore, top clamping slit, transverse X clamp-screw bore and two vertical foot mounting bores. Bottom Z=0. No thread, clamp hardware or load rating is specified. */
export function createShaftSupportGeom(
  input: ShaftSupportModelPropsInput = {},
) {
  const p = shaftSupportModelPropsSchema.parse(input)

  const top = p.baseThickness + p.headHeight
  const body = union(
    motionBox(p.baseWidth, p.baseDepth, p.baseThickness, [
      0,
      0,
      p.baseThickness / 2,
    ]),
    motionBox(p.headWidth, p.headDepth, p.headHeight, [
      0,
      0,
      p.baseThickness + p.headHeight / 2,
    ]),
  )
  const shaft = motionCylinderY(p.boreDiameter, p.baseDepth + 0.4, [
    0,
    0,
    p.centerHeight,
  ])
  const slit = motionBox(
    p.slitWidth,
    p.headDepth + 0.4,
    top - p.centerHeight + 0.2,
    [0, 0, (top + p.centerHeight) / 2 + 0.1],
  )
  const clampZ = (top + p.centerHeight + p.boreDiameter / 2) / 2
  const clamp = motionCylinderX(p.clampHoleDiameter, p.headWidth + 0.4, [
    0,
    0,
    clampZ,
  ])
  const mounts = [-1, 1].map((side) =>
    translate(
      [(side * p.mountSpacing) / 2, 0, 0],
      motionCylinder(p.mountHoleDiameter, p.baseThickness + 0.4, -0.2),
    ),
  )
  return subtract(body, shaft, slit, clamp, ...mounts)
}
export function createShaftSupportMesh(
  input: ShaftSupportModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createShaftSupportGeom(input))
}
