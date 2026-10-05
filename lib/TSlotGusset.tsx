import type { TSlotGussetModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"
import { createTSlotGussetMesh } from "./mechanical/tslot-gusset-mesh"

export type TSlotGussetProps = TSlotGussetModelPropsInput & { color?: string }

export function createTSlotGussetGeom(input: TSlotGussetModelPropsInput = {}) {
  return indexedMeshToGeom3(createTSlotGussetMesh(input))
}

export function TSlotGusset({ color = "#8995a3", ...props }: TSlotGussetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotGussetGeom(props)} />
    </Colorize>
  )
}

export { createTSlotGussetMesh } from "./mechanical/tslot-gusset-mesh"
export type { TSlotGussetMesh } from "./mechanical/tslot-gusset-mesh"
