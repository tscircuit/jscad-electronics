import type { WormGearModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createWormGearMesh } from "./mechanical/worm-gear-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type WormGearProps = WormGearModelPropsInput & {
  color?: string
}

/** Square-cut worm along +Z, from Z=0 to length. Threads are approximate. */
export function createWormGearGeom(input: WormGearModelPropsInput) {
  return indexedMeshToGeom3(createWormGearMesh(input))
}

export function WormGear({ color = "#737e8f", ...props }: WormGearProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createWormGearGeom(props)} />
    </Colorize>
  )
}

export { createWormGearMesh } from "./mechanical/worm-gear-mesh"
export type { WormGearMesh } from "./mechanical/worm-gear-mesh"
