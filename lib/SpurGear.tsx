import type { SpurGearModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"
import { createSpurGearMesh } from "./mechanical/spur-gear-mesh"

export type SpurGearProps = SpurGearModelPropsInput & { color?: string }

/** Axis +Z, lower face Z=0; optional hub extends above the gear face. */
export function createSpurGearGeom(input: SpurGearModelPropsInput) {
  return indexedMeshToGeom3(createSpurGearMesh(input))
}

export function SpurGear({ color = "#737e8f", ...props }: SpurGearProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSpurGearGeom(props)} />
    </Colorize>
  )
}

export { createSpurGearMesh } from "./mechanical/spur-gear-mesh"
export type { SpurGearMesh } from "./mechanical/spur-gear-mesh"
