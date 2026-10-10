import type { ZeeBarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createZeeBarMesh } from "./mesh"
export type ZeeBarProps = ZeeBarModelPropsInput & { color?: string }
export function createZeeBarGeom(input: ZeeBarModelPropsInput) {
  return indexedMeshToGeom3(createZeeBarMesh(input))
}
export function ZeeBar({ color = "#8995a3", ...props }: ZeeBarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createZeeBarGeom(props)} />
    </Colorize>
  )
}
export { createZeeBarMesh } from "./mesh"
export type { ZeeBarMesh } from "./mesh"
