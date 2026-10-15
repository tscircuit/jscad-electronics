import jscad from "@jscad/modeling"
import {
  conveyorRollerModelPropsSchema,
  type ConveyorRollerModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
} from "../../mechanical/motion-geometry-utils"
const { union } = jscad.booleans
/** Hollow conveyor tube with end plugs and a continuous axle projecting beyond each end. Axis Z, tube spans Z=0..length and axle starts at negative shaftExtension. End plugs are nominal; internal bearings and shaft flats are not specified. */
export function createConveyorRollerGeom(
  input: ConveyorRollerModelPropsInput = {},
) {
  const p = conveyorRollerModelPropsSchema.parse(input)

  const tube = motionRing(
    p.outerDiameter,
    p.outerDiameter - 2 * p.wallThickness,
    p.length,
  )
  const endA = motionRing(p.outerDiameter, p.shaftDiameter, p.endThickness)
  const endB = motionRing(
    p.outerDiameter,
    p.shaftDiameter,
    p.endThickness,
    p.length - p.endThickness,
  )
  const shaft = motionCylinder(
    p.shaftDiameter,
    p.length + 2 * p.shaftExtension,
    -p.shaftExtension,
  )
  return union(tube, endA, endB, shaft)
}
export function createConveyorRollerMesh(
  input: ConveyorRollerModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createConveyorRollerGeom(input))
}
