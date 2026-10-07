import type { GooseneckModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createGooseneckMesh } from "./mesh"

export type GooseneckProps = GooseneckModelPropsInput & { color?: string }

export function createGooseneckGeom(input: GooseneckModelPropsInput) {
  return indexedMeshToGeom3(createGooseneckMesh(input))
}

export function Gooseneck({ color = "#343943", ...props }: GooseneckProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createGooseneckGeom(props)} />
    </Colorize>
  )
}

export { createGooseneckMesh } from "./mesh"
export type { GooseneckMesh, GooseneckMeshOptions } from "./mesh"
