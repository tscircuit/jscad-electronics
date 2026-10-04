import {
  getHelicalGearDimensions,
  helicalGearModelPropsSchema,
  type HelicalGearModelPropsInput,
} from "@tscircuit/modelprinter"
import { createTwistedSpurGearMesh, type SpurGearMesh } from "./spur-gear-mesh"

export type HelicalGearMesh = SpurGearMesh

/**
 * Twisted transverse involute teeth from Z=0 to faceWidth, with a stationary
 * round bore and optional hub. Zero helix angle reproduces the spur mesh.
 */
export function createHelicalGearMesh(
  input: HelicalGearModelPropsInput,
): HelicalGearMesh {
  const props = helicalGearModelPropsSchema.parse(input)
  const { twistAngle } = getHelicalGearDimensions(props)
  const { helixAngle, handedness, segmentsPerTurn, ...spur } = props
  return createTwistedSpurGearMesh(
    spur,
    (twistAngle * Math.PI) / 180,
    segmentsPerTurn,
  )
}
