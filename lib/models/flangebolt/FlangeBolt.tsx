import type { FlangeBoltModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createFlangeBoltMesh, type FlangeBoltMeshOptions } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
export type FlangeBoltProps = FlangeBoltModelPropsInput & { color?: string }
export function createFlangeBoltGeom(
  input: FlangeBoltModelPropsInput,
  options?: FlangeBoltMeshOptions,
) {
  return indexedMeshToGeom3(createFlangeBoltMesh(input, options))
}
export function FlangeBolt({ color = "#737e8f", ...props }: FlangeBoltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlangeBoltGeom(props)} />
    </Colorize>
  )
}
