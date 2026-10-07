import type { TimingPulleyModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createTimingPulleyMesh, type TimingPulleyMeshOptions } from "./mesh"
export type TimingPulleyProps = TimingPulleyModelPropsInput & { color?: string }
export function createTimingPulleyGeom(
  input: TimingPulleyModelPropsInput = {},
  options: TimingPulleyMeshOptions = {},
) {
  return indexedMeshToGeom3(createTimingPulleyMesh(input, options))
}
export function TimingPulley({
  color = "#aab3bf",
  ...props
}: TimingPulleyProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTimingPulleyGeom(props)} />
    </Colorize>
  )
}
export * from "./mesh"
