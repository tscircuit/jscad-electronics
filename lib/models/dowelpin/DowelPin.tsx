import type { DowelPinModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createDowelPinMesh, type DowelPinMeshOptions } from "./mesh"
export type DowelPinProps = DowelPinModelPropsInput & { color?: string }
export function createDowelPinGeom(
  input: DowelPinModelPropsInput,
  resolution?: DowelPinMeshOptions,
) {
  return indexedMeshToGeom3(createDowelPinMesh(input, resolution))
}
export function DowelPin({ color = "#929da9", ...props }: DowelPinProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createDowelPinGeom(props)} />
    </Colorize>
  )
}
