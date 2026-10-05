import type { TSlotInsideCornerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createTSlotInsideCornerMesh } from "./mesh"

export type TSlotInsideCornerProps = TSlotInsideCornerModelPropsInput & {
  color?: string
}

export function createTSlotInsideCornerGeom(
  input: TSlotInsideCornerModelPropsInput = {},
) {
  return indexedMeshToGeom3(createTSlotInsideCornerMesh(input))
}

export function TSlotInsideCorner({
  color = "#8995a3",
  ...props
}: TSlotInsideCornerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotInsideCornerGeom(props)} />
    </Colorize>
  )
}

export { createTSlotInsideCornerMesh } from "./mesh"
export type { TSlotInsideCornerMesh } from "./mesh"
