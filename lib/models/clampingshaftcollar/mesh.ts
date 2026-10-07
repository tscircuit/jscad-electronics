import jscad from "@jscad/modeling"
import {
  clampingShaftCollarModelPropsSchema,
  getClampingShaftCollarDimensions,
  type ClampingShaftCollarModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  assertShaftMountResolution,
  createAnnularSleeve,
  createMountingHoleCutter,
  finishShaftMountMesh,
  subtractShaftMountParts,
  type ShaftMountMesh,
} from "../../mechanical/shaft-mount-geometry"

export type ClampingShaftCollarMesh = ShaftMountMesh

/** Geometry is driven by the corresponding modelprinter schema and hole layout. */
export function createClampingShaftCollarMesh(
  input: ClampingShaftCollarModelPropsInput,
): ClampingShaftCollarMesh {
  const props = clampingShaftCollarModelPropsSchema.parse(input)
  const dimensions = getClampingShaftCollarDimensions(props)
  assertShaftMountResolution([dimensions.threadedHole])
  const body = createAnnularSleeve({
    outerRadius: props.outerDiameter / 2,
    boreARadius: props.boreDiameter / 2,
    length: props.width,
    chamfer: props.chamfer,
  })
  const s = dimensions.split
  const epsilon = 1e-4
  const slit = jscad.primitives.cuboid({
    size: [
      s.xMax - s.xMin + epsilon,
      s.yMax - s.yMin,
      s.zMax - s.zMin + 2 * epsilon,
    ],
    center: [
      (s.xMax + s.xMin + epsilon) / 2,
      (s.yMax + s.yMin) / 2,
      (s.zMax + s.zMin) / 2,
    ],
  })
  return finishShaftMountMesh(
    subtractShaftMountParts(
      body,
      slit,
      createMountingHoleCutter(dimensions.clearanceHole),
      createMountingHoleCutter(dimensions.threadedHole),
    ),
  )
}
