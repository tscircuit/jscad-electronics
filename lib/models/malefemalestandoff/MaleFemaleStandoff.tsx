import type { MaleFemaleStandoffModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  createMaleFemaleStandoffMesh,
  type MaleFemaleStandoffMeshOptions,
} from "./mesh"
export type MaleFemaleStandoffProps = MaleFemaleStandoffModelPropsInput & {
  color?: string
}
export function createMaleFemaleStandoffGeom(
  input: MaleFemaleStandoffModelPropsInput,
  resolution?: MaleFemaleStandoffMeshOptions,
) {
  return indexedMeshToGeom3(createMaleFemaleStandoffMesh(input, resolution))
}
export function MaleFemaleStandoff({
  color = "#b79a54",
  ...props
}: MaleFemaleStandoffProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createMaleFemaleStandoffGeom(props)} />
    </Colorize>
  )
}
