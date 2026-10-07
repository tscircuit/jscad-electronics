import type { HexNutModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHexNutMesh, type HexNutMeshOptions } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export type HexNutProps = HexNutModelPropsInput & { color?: string }
export function createHexNutGeom(
  input: HexNutModelPropsInput,
  resolution?: HexNutMeshOptions,
) {
  return indexedMeshToGeom3(createHexNutMesh(input, resolution))
}
export function HexNut({ color = "#737e8f", ...props }: HexNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHexNutGeom(props)} />
    </Colorize>
  )
}
export { createHexNutMesh } from "./mesh"
export type { HexNutMesh, HexNutMeshOptions } from "./mesh"
