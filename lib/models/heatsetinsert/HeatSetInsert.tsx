import type { HeatSetInsertModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHeatSetInsertMesh, type HeatSetInsertMeshOptions } from "./mesh"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
export type HeatSetInsertProps = HeatSetInsertModelPropsInput & {
  color?: string
}
export function createHeatSetInsertGeom(
  input: HeatSetInsertModelPropsInput,
  options?: HeatSetInsertMeshOptions,
) {
  return indexedMeshToGeom3(createHeatSetInsertMesh(input, options))
}
export function HeatSetInsert({
  color = "#bd8c45",
  ...props
}: HeatSetInsertProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHeatSetInsertGeom(props)} />
    </Colorize>
  )
}
