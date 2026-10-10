import type { SlottedChannelModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createSlottedChannelMesh } from "./mesh"
export type SlottedChannelProps = SlottedChannelModelPropsInput & {
  color?: string
}
export function createSlottedChannelGeom(input: SlottedChannelModelPropsInput) {
  return indexedMeshToGeom3(createSlottedChannelMesh(input))
}
export function SlottedChannel({
  color = "#8995a3",
  ...props
}: SlottedChannelProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSlottedChannelGeom(props)} />
    </Colorize>
  )
}
export { createSlottedChannelMesh } from "./mesh"
export type { SlottedChannelMesh } from "./mesh"
