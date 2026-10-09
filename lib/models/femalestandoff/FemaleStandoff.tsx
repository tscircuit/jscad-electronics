import type { FemaleStandoffModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  createFemaleStandoffMesh,
  type FemaleStandoffMeshOptions,
} from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export type FemaleStandoffProps = FemaleStandoffModelPropsInput & {
  color?: string
}
export function createFemaleStandoffGeom(
  input: FemaleStandoffModelPropsInput,
  resolution?: FemaleStandoffMeshOptions,
) {
  return indexedMeshToGeom3(createFemaleStandoffMesh(input, resolution))
}
export function FemaleStandoff({
  color = "#737e8f",
  ...props
}: FemaleStandoffProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFemaleStandoffGeom(props)} />
    </Colorize>
  )
}
export { createFemaleStandoffMesh } from "./mesh"
export type { FemaleStandoffMesh, FemaleStandoffMeshOptions } from "./mesh"
