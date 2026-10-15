import {
  vGrooveWheelModelPropsSchema,
  type VGrooveWheelModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import { motionRevolve } from "../../mechanical/motion-geometry-utils"
/** Symmetric V-groove track wheel with straight axial bore. Z axis, bottom Z=0. Groove flanks run from 20%/80% of the width to the central root; this nominal track envelope does not specify a bearing or rail standard. */
export function createVGrooveWheelGeom(
  input: VGrooveWheelModelPropsInput = {},
) {
  const p = vGrooveWheelModelPropsSchema.parse(input)

  return motionRevolve([
    [p.boreDiameter / 2, 0],
    [p.outerDiameter / 2, 0],
    [p.outerDiameter / 2, p.width * 0.2],
    [p.rootDiameter / 2, p.width / 2],
    [p.outerDiameter / 2, p.width * 0.8],
    [p.outerDiameter / 2, p.width],
    [p.boreDiameter / 2, p.width],
  ])
}
export function createVGrooveWheelMesh(
  input: VGrooveWheelModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createVGrooveWheelGeom(input))
}
