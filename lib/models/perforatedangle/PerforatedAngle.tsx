import type { PerforatedAngleModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createPerforatedAngleMesh } from "./mesh"
export type PerforatedAngleProps = PerforatedAngleModelPropsInput & {
  color?: string
}
export function createPerforatedAngleGeom(
  input: PerforatedAngleModelPropsInput,
) {
  return indexedMeshToGeom3(createPerforatedAngleMesh(input))
}
export function PerforatedAngle({
  color = "#8995a3",
  ...props
}: PerforatedAngleProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPerforatedAngleGeom(props)} />
    </Colorize>
  )
}
export { createPerforatedAngleMesh } from "./mesh"
export type { PerforatedAngleMesh } from "./mesh"
