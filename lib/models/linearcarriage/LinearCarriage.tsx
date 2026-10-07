import type { LinearCarriageModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createLinearCarriageMesh } from "./mesh"
export type LinearCarriageProps = LinearCarriageModelPropsInput & {
  color?: string
}
export function createLinearCarriageGeom(
  input: LinearCarriageModelPropsInput = {},
) {
  return indexedMeshToGeom3(createLinearCarriageMesh(input))
}
export function LinearCarriage({
  color = "#596e87",
  ...props
}: LinearCarriageProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLinearCarriageGeom(props)} />
    </Colorize>
  )
}
export { createLinearCarriageMesh } from "./mesh"
export type { LinearCarriageMesh } from "./mesh"
