import {
  spacerModelPropsSchema,
  type SpacerModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  createPlainBushingMesh,
  type PlainBushingMesh,
} from "../plainbushing/mesh"

export type SpacerMesh = PlainBushingMesh
/** Closed annular surface; the through opening never receives a center cap. */
export function createSpacerMesh(input: SpacerModelPropsInput): SpacerMesh {
  const props = spacerModelPropsSchema.parse(input)
  return createPlainBushingMesh({
    innerDiameter: props.innerDiameter,
    outerDiameter: props.outerDiameter,
    length: props.length,
    edgeChamfer: props.chamfer,
  })
}
