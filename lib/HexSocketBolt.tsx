import { componentMaterials } from "./materials"
import type { HexSocketBoltModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHexSocketBoltMesh } from "./mechanical/hex-socket-bolt-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type HexSocketBoltProps = HexSocketBoltModelPropsInput & {
  color?: string
}

/** Bearing plane Z=0, tip along -Z, head along +Z. Threads are approximate. */
export function createHexSocketBoltGeom(input: HexSocketBoltModelPropsInput) {
  return indexedMeshToGeom3(createHexSocketBoltMesh(input))
}

export function HexSocketBolt({
  color = "#737e8f",
  ...props
}: HexSocketBoltProps) {
  return (
    <Colorize color={color} material={componentMaterials.steel}>
      <Custom geometry={createHexSocketBoltGeom(props)} />
    </Colorize>
  )
}

export { createHexSocketBoltMesh } from "./mechanical/hex-socket-bolt-mesh"
export type { HexSocketBoltMesh } from "./mechanical/hex-socket-bolt-mesh"
