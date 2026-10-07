import type { FlangedBushingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createFlangedBushingMesh } from "./mesh"

export type FlangedBushingProps = FlangedBushingModelPropsInput & {
  color?: string
}

/** Square integral flange at the Z=0 end; bore continues through overall length. */
export function createFlangedBushingGeom(input: FlangedBushingModelPropsInput) {
  return indexedMeshToGeom3(createFlangedBushingMesh(input))
}

export function FlangedBushing({
  color = "#a18450",
  ...props
}: FlangedBushingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlangedBushingGeom(props)} />
    </Colorize>
  )
}

export { createFlangedBushingMesh } from "./mesh"
export type { FlangedBushingMesh } from "./mesh"
