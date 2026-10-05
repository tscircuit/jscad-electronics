import jscad from "@jscad/modeling"
import {
  shaftCollarModelPropsSchema,
  getShaftCollarDimensions,
  type ShaftCollarModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  assertShaftMountResolution,
  createAnnularSleeve,
  createMountingHoleCutter,
  finishShaftMountMesh,
  subtractShaftMountParts,
  type ShaftMountMesh,
} from "./shaft-mount-geometry"

export type ShaftCollarMesh = ShaftMountMesh

/** Geometry is driven by the corresponding modelprinter schema and hole layout. */
export function createShaftCollarMesh(
  input: ShaftCollarModelPropsInput,
): ShaftCollarMesh {
  const props = shaftCollarModelPropsSchema.parse(input)
  const dimensions = getShaftCollarDimensions(props)
  assertShaftMountResolution([dimensions.screwHole])
  const body = createAnnularSleeve({
    outerRadius: props.outerDiameter / 2,
    boreARadius: props.boreDiameter / 2,
    length: props.width,
    chamfer: props.chamfer,
  })
  return finishShaftMountMesh(
    subtractShaftMountParts(
      body,
      createMountingHoleCutter(dimensions.screwHole),
    ),
  )
}
