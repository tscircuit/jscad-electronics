import type { LinearRailModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createLinearRailMesh } from "./mesh"
export type LinearRailProps = LinearRailModelPropsInput & { color?: string }
export function createLinearRailGeom(input: LinearRailModelPropsInput = {}) {
  return indexedMeshToGeom3(createLinearRailMesh(input))
}
export function LinearRail({ color = "#78848e", ...props }: LinearRailProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLinearRailGeom(props)} />
    </Colorize>
  )
}
export { createLinearRailMesh } from "./mesh"
export type { LinearRailMesh } from "./mesh"
