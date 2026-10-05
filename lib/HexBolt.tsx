import type { HexBoltModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  createHexBoltMesh,
  type HexBoltMeshOptions,
} from "./mechanical/hex-bolt-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type HexBoltProps = HexBoltModelPropsInput & { color?: string }
export function createHexBoltGeom(
  input: HexBoltModelPropsInput,
  options?: HexBoltMeshOptions,
) {
  return indexedMeshToGeom3(createHexBoltMesh(input, options))
}
export function HexBolt({ color = "#737e8f", ...props }: HexBoltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHexBoltGeom(props)} />
    </Colorize>
  )
}
export { createHexBoltMesh } from "./mechanical/hex-bolt-mesh"
export type {
  HexBoltMesh,
  HexBoltMeshOptions,
} from "./mechanical/hex-bolt-mesh"
