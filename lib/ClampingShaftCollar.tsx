import type { ClampingShaftCollarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createClampingShaftCollarMesh } from "./mechanical/clamping-shaft-collar-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type ClampingShaftCollarProps = ClampingShaftCollarModelPropsInput & {
  color?: string
}

/** Datum and mounting-hole coordinates follow the modelprinter contract. */
export function createClampingShaftCollarGeom(
  input: ClampingShaftCollarModelPropsInput,
) {
  return indexedMeshToGeom3(createClampingShaftCollarMesh(input))
}

export function ClampingShaftCollar({
  color = "#737e8f",
  ...props
}: ClampingShaftCollarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createClampingShaftCollarGeom(props)} />
    </Colorize>
  )
}
export { createClampingShaftCollarMesh } from "./mechanical/clamping-shaft-collar-mesh"
export type { ClampingShaftCollarMesh } from "./mechanical/clamping-shaft-collar-mesh"
