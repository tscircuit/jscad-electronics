import type { HelicalGearModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"
import { createHelicalGearMesh } from "./mechanical/helical-gear-mesh"

export type HelicalGearProps = HelicalGearModelPropsInput & { color?: string }

/** Axis +Z, lower face Z=0; optional hub extends above the gear face. */
export function createHelicalGearGeom(input: HelicalGearModelPropsInput) {
  return indexedMeshToGeom3(createHelicalGearMesh(input))
}

export function HelicalGear({ color = "#737e8f", ...props }: HelicalGearProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHelicalGearGeom(props)} />
    </Colorize>
  )
}

export { createHelicalGearMesh } from "./mechanical/helical-gear-mesh"
export type { HelicalGearMesh } from "./mechanical/helical-gear-mesh"
