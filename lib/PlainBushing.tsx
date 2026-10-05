import type { PlainBushingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"
import { createPlainBushingMesh } from "./mechanical/plain-bushing-mesh"

export type PlainBushingProps = PlainBushingModelPropsInput & { color?: string }

/** Through sleeve from Z=0 to length, with four optional 45-degree rim chamfers. */
export function createPlainBushingGeom(input: PlainBushingModelPropsInput) {
  return indexedMeshToGeom3(createPlainBushingMesh(input))
}

export function PlainBushing({
  color = "#a18450",
  ...props
}: PlainBushingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPlainBushingGeom(props)} />
    </Colorize>
  )
}

export { createPlainBushingMesh } from "./mechanical/plain-bushing-mesh"
export type { PlainBushingMesh } from "./mechanical/plain-bushing-mesh"
