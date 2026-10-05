import jscad from "@jscad/modeling"
import {
  rigidCouplerModelPropsSchema,
  getRigidCouplerDimensions,
  type RigidCouplerModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  assertShaftMountResolution,
  createAnnularSleeve,
  createMountingHoleCutter,
  finishShaftMountMesh,
  subtractShaftMountParts,
  type ShaftMountMesh,
} from "./shaft-mount-geometry"

export type RigidCouplerMesh = ShaftMountMesh

/** Geometry is driven by the corresponding modelprinter schema and hole layout. */
export function createRigidCouplerMesh(
  input: RigidCouplerModelPropsInput,
): RigidCouplerMesh {
  const props = rigidCouplerModelPropsSchema.parse(input)
  const dimensions = getRigidCouplerDimensions(props)
  assertShaftMountResolution(dimensions.screwHoles)
  const body = createAnnularSleeve({
    outerRadius: props.outerDiameter / 2,
    boreARadius: props.boreDiameter / 2,
    boreBRadius: props.boreBDiameter / 2,
    length: props.length,
    chamfer: props.chamfer,
    stepZ: dimensions.boreADepth,
  })
  return finishShaftMountMesh(
    subtractShaftMountParts(
      body,
      ...dimensions.screwHoles.map(createMountingHoleCutter),
    ),
  )
}
