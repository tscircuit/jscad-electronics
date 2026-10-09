import type { SpacerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createSpacerMesh } from "./mesh"

export type SpacerProps = SpacerModelPropsInput & { color?: string }
/** Round unthreaded spacer, with lower end at Z=0 and upper end at Z=length. */
export function createSpacerGeom(input: SpacerModelPropsInput) {
  return indexedMeshToGeom3(createSpacerMesh(input))
}
export function Spacer({ color = "#a18450", ...props }: SpacerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSpacerGeom(props)} />
    </Colorize>
  )
}
export { createSpacerMesh } from "./mesh"
export type { SpacerMesh } from "./mesh"
