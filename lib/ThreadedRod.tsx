import type { ThreadedRodModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  createThreadedRodMesh,
  type ThreadedRodMeshOptions,
} from "./mechanical/threaded-rod-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type ThreadedRodProps = ThreadedRodModelPropsInput & { color?: string }
export function createThreadedRodGeom(
  input: ThreadedRodModelPropsInput,
  resolution?: ThreadedRodMeshOptions,
) {
  return indexedMeshToGeom3(createThreadedRodMesh(input, resolution))
}
export function ThreadedRod({ color = "#737e8f", ...props }: ThreadedRodProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createThreadedRodGeom(props)} />
    </Colorize>
  )
}
export { createThreadedRodMesh } from "./mechanical/threaded-rod-mesh"
export type {
  ThreadedRodMesh,
  ThreadedRodMeshOptions,
} from "./mechanical/threaded-rod-mesh"
