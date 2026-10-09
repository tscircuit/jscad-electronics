import type { SetScrewModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSetScrewMesh, type SetScrewMeshOptions } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
export type SetScrewProps = SetScrewModelPropsInput & { color?: string }
export function createSetScrewGeom(
  input: SetScrewModelPropsInput,
  options?: SetScrewMeshOptions,
) {
  return indexedMeshToGeom3(createSetScrewMesh(input, options))
}
export function SetScrew({ color = "#737e8f", ...props }: SetScrewProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSetScrewGeom(props)} />
    </Colorize>
  )
}
