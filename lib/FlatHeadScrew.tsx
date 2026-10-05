import type { FlatHeadScrewModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  createFlatHeadScrewMesh,
  type FlatHeadScrewMeshOptions,
} from "./mechanical/flat-head-screw-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type FlatHeadScrewProps = FlatHeadScrewModelPropsInput & {
  color?: string
}
export function createFlatHeadScrewGeom(
  input: FlatHeadScrewModelPropsInput,
  options?: FlatHeadScrewMeshOptions,
) {
  return indexedMeshToGeom3(createFlatHeadScrewMesh(input, options))
}
export function FlatHeadScrew({
  color = "#737e8f",
  ...props
}: FlatHeadScrewProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlatHeadScrewGeom(props)} />
    </Colorize>
  )
}
export { createFlatHeadScrewMesh } from "./mechanical/flat-head-screw-mesh"
export type {
  FlatHeadScrewMesh,
  FlatHeadScrewMeshOptions,
} from "./mechanical/flat-head-screw-mesh"
