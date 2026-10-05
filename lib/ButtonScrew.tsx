import type { ButtonScrewModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  createButtonScrewMesh,
  type ButtonScrewMeshOptions,
} from "./mechanical/button-screw-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type ButtonScrewProps = ButtonScrewModelPropsInput & { color?: string }
export function createButtonScrewGeom(
  input: ButtonScrewModelPropsInput,
  resolution?: ButtonScrewMeshOptions,
) {
  return indexedMeshToGeom3(createButtonScrewMesh(input, resolution))
}
export function ButtonScrew({ color = "#737e8f", ...props }: ButtonScrewProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createButtonScrewGeom(props)} />
    </Colorize>
  )
}
export { createButtonScrewMesh } from "./mechanical/button-screw-mesh"
export type {
  ButtonScrewMesh,
  ButtonScrewMeshOptions,
} from "./mechanical/button-screw-mesh"
