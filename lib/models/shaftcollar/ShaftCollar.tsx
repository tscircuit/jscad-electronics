import type { ShaftCollarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createShaftCollarMesh } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export type ShaftCollarProps = ShaftCollarModelPropsInput & { color?: string }

/** Datum and mounting-hole coordinates follow the modelprinter contract. */
export function createShaftCollarGeom(input: ShaftCollarModelPropsInput) {
  return indexedMeshToGeom3(createShaftCollarMesh(input))
}

export function ShaftCollar({ color = "#737e8f", ...props }: ShaftCollarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createShaftCollarGeom(props)} />
    </Colorize>
  )
}
export { createShaftCollarMesh } from "./mesh"
export type { ShaftCollarMesh } from "./mesh"
