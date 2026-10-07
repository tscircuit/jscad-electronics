import type { TimingBeltModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createTimingBeltMesh } from "./mesh"
export type TimingBeltProps = TimingBeltModelPropsInput & { color?: string }
export function createTimingBeltGeom(input: TimingBeltModelPropsInput = {}) {
  return indexedMeshToGeom3(createTimingBeltMesh(input))
}
export function TimingBelt({ color = "#263238", ...props }: TimingBeltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTimingBeltGeom(props)} />
    </Colorize>
  )
}
export * from "./mesh"
