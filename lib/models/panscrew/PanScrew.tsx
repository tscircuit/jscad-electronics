import type { PanScrewModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPanScrewMesh, type PanScrewMeshOptions } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export type PanScrewProps = PanScrewModelPropsInput & { color?: string }
export function createPanScrewGeom(
  input: PanScrewModelPropsInput,
  options?: PanScrewMeshOptions,
) {
  return indexedMeshToGeom3(createPanScrewMesh(input, options))
}
export function PanScrew({ color = "#737e8f", ...props }: PanScrewProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPanScrewGeom(props)} />
    </Colorize>
  )
}
export { createPanScrewMesh } from "./mesh"
export type {
  PanScrewMesh,
  PanScrewMeshOptions,
} from "./mesh"
