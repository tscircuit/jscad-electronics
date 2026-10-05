import type { TSlotExtrusionModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"
import { createTSlotExtrusionMesh } from "./mechanical/tslot-extrusion-mesh"

export type TSlotExtrusionProps = TSlotExtrusionModelPropsInput & {
  color?: string
}

export function createTSlotExtrusionGeom(
  input: TSlotExtrusionModelPropsInput = {},
) {
  return indexedMeshToGeom3(createTSlotExtrusionMesh(input))
}

export function TSlotExtrusion({
  color = "#8995a3",
  ...props
}: TSlotExtrusionProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotExtrusionGeom(props)} />
    </Colorize>
  )
}

export { createTSlotExtrusionMesh } from "./mechanical/tslot-extrusion-mesh"
export type { TSlotExtrusionMesh } from "./mechanical/tslot-extrusion-mesh"
