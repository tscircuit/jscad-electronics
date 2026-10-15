import type { ReducingBushingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createReducingBushingGeom } from "./geometry"
export type ReducingBushingProps = ReducingBushingModelPropsInput & {
  color?: string
}
export function ReducingBushing({
  color = "#87929f",
  ...props
}: ReducingBushingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createReducingBushingGeom(props)} />
    </Colorize>
  )
}
