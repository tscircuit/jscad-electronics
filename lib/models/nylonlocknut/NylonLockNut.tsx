import type { NylonLockNutModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  createNylonLockNutMesh,
  createNylonLockNutMeshes,
  type NylonLockNutMeshOptions,
} from "./mesh"

export type NylonLockNutProps = NylonLockNutModelPropsInput & {
  color?: string
  insertColor?: string
}
/** Monolithic assembly exterior for CAD/export consumers. */
export function createNylonLockNutGeom(
  input: NylonLockNutModelPropsInput,
  resolution?: NylonLockNutMeshOptions,
) {
  return indexedMeshToGeom3(createNylonLockNutMesh(input, resolution))
}
/** Separate closed material solids for colored rendering. */
export function createNylonLockNutGeometries(
  input: NylonLockNutModelPropsInput,
  resolution?: NylonLockNutMeshOptions,
) {
  const parts = createNylonLockNutMeshes(input, resolution)
  return {
    metal: indexedMeshToGeom3(parts.metal),
    insert: indexedMeshToGeom3(parts.insert),
  }
}
export function NylonLockNut({
  color = "#737e8f",
  insertColor = "#236cd2",
  ...props
}: NylonLockNutProps) {
  const geometry = createNylonLockNutGeometries(props)
  return (
    <>
      <Colorize color={color}>
        <Custom geometry={geometry.metal} />
      </Colorize>
      <Colorize color={insertColor}>
        <Custom geometry={geometry.insert} />
      </Colorize>
    </>
  )
}
export { createNylonLockNutMesh, createNylonLockNutMeshes } from "./mesh"
export type {
  NylonLockNutMesh,
  NylonLockNutMeshes,
  NylonLockNutMeshOptions,
} from "./mesh"
