import type { AdhesiveMountElectricalComponentHeatsinkModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createAdhesiveMountElectricalComponentHeatsinkMesh } from "./mesh"
export type AdhesiveMountElectricalComponentHeatsinkProps =
  AdhesiveMountElectricalComponentHeatsinkModelPropsInput & {
    color?: string
  }
export function createAdhesiveMountElectricalComponentHeatsinkGeom(
  input: AdhesiveMountElectricalComponentHeatsinkModelPropsInput,
) {
  return indexedMeshToGeom3(
    createAdhesiveMountElectricalComponentHeatsinkMesh(input),
  )
}
export function AdhesiveMountElectricalComponentHeatsink({
  color = "#46515e",
  ...props
}: AdhesiveMountElectricalComponentHeatsinkProps) {
  return (
    <Colorize color={color}>
      <Custom
        geometry={createAdhesiveMountElectricalComponentHeatsinkGeom(props)}
      />
    </Colorize>
  )
}
export { createAdhesiveMountElectricalComponentHeatsinkMesh } from "./mesh"
export type { AdhesiveMountElectricalComponentHeatsinkMesh } from "./mesh"
