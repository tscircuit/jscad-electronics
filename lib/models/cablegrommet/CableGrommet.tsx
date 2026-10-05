import type { CableGrommetModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCableGrommetMesh } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export type CableGrommetProps = CableGrommetModelPropsInput & { color?: string }

export function createCableGrommetGeom(input: CableGrommetModelPropsInput) {
  return indexedMeshToGeom3(createCableGrommetMesh(input))
}

export function CableGrommet({
  color = "#343943",
  ...props
}: CableGrommetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCableGrommetGeom(props)} />
    </Colorize>
  )
}

export { createCableGrommetMesh } from "./mesh"
export type {
  CableGrommetMesh,
  CableGrommetMeshOptions,
} from "./mesh"
