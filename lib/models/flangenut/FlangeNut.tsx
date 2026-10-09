import type { FlangeNutModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createFlangeNutMesh, type FlangeNutMeshOptions } from "./mesh"

export type FlangeNutProps = FlangeNutModelPropsInput & { color?: string }
export function createFlangeNutGeom(
  input: FlangeNutModelPropsInput,
  resolution?: FlangeNutMeshOptions,
) {
  return indexedMeshToGeom3(createFlangeNutMesh(input, resolution))
}
export function FlangeNut({ color = "#737e8f", ...props }: FlangeNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlangeNutGeom(props)} />
    </Colorize>
  )
}
