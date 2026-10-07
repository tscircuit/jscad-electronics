import type { BeltIdlerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createBeltIdlerMesh, type BeltIdlerMeshOptions } from "./mesh"
export type BeltIdlerProps = BeltIdlerModelPropsInput & { color?: string }
export function createBeltIdlerGeom(
  input: BeltIdlerModelPropsInput = {},
  options: BeltIdlerMeshOptions = {},
) {
  return indexedMeshToGeom3(createBeltIdlerMesh(input, options))
}
export function BeltIdler({ color = "#aab3bf", ...props }: BeltIdlerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBeltIdlerGeom(props)} />
    </Colorize>
  )
}
export * from "./mesh"
