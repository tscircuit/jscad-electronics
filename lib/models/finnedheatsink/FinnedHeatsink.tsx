import type { FinnedHeatsinkModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createFinnedHeatsinkMesh } from "./mesh"
export type FinnedHeatsinkProps = FinnedHeatsinkModelPropsInput & {
  color?: string
}
export function createFinnedHeatsinkGeom(input: FinnedHeatsinkModelPropsInput) {
  return indexedMeshToGeom3(createFinnedHeatsinkMesh(input))
}
export function FinnedHeatsink({
  color = "#46515e",
  ...props
}: FinnedHeatsinkProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFinnedHeatsinkGeom(props)} />
    </Colorize>
  )
}
export { createFinnedHeatsinkMesh } from "./mesh"
export type { FinnedHeatsinkMesh } from "./mesh"
