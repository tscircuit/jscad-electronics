import type { HollowPositioningArmTubeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createHollowPositioningArmTubeMesh } from "./mesh"

export type HollowPositioningArmTubeProps =
  HollowPositioningArmTubeModelPropsInput & { color?: string }

export function createHollowPositioningArmTubeGeom(
  input: HollowPositioningArmTubeModelPropsInput,
) {
  return indexedMeshToGeom3(createHollowPositioningArmTubeMesh(input))
}

export function HollowPositioningArmTube({
  color = "#343943",
  ...props
}: HollowPositioningArmTubeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHollowPositioningArmTubeGeom(props)} />
    </Colorize>
  )
}

export { createHollowPositioningArmTubeMesh } from "./mesh"
export type {
  HollowPositioningArmTubeMesh,
  HollowPositioningArmTubeMeshOptions,
} from "./mesh"
