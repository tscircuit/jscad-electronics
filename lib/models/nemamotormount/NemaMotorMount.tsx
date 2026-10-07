import type { NemaMotorMountModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createNemaMotorMountMesh } from "./mesh"

export type NemaMotorMountProps = NemaMotorMountModelPropsInput & {
  color?: string
}

export function createNemaMotorMountGeom(
  input: NemaMotorMountModelPropsInput = {},
) {
  return indexedMeshToGeom3(createNemaMotorMountMesh(input))
}

export function NemaMotorMount({
  color = "#84909d",
  ...props
}: NemaMotorMountProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createNemaMotorMountGeom(props)} />
    </Colorize>
  )
}

export { createNemaMotorMountMesh } from "./mesh"
export type { NemaMotorMountMesh } from "./mesh"
