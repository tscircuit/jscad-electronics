import type { HatSectionModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createHatSectionMesh } from "./mesh"
export type HatSectionProps = HatSectionModelPropsInput & { color?: string }
export function createHatSectionGeom(input: HatSectionModelPropsInput) {
  return indexedMeshToGeom3(createHatSectionMesh(input))
}
export function HatSection({ color = "#8995a3", ...props }: HatSectionProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHatSectionGeom(props)} />
    </Colorize>
  )
}
export { createHatSectionMesh } from "./mesh"
export type { HatSectionMesh } from "./mesh"
