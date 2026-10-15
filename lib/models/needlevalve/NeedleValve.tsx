import type { NeedleValveModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createNeedleValveGeom } from "./geometry"
export type NeedleValveProps = NeedleValveModelPropsInput & { color?: string }
export function NeedleValve({ color = "#87929f", ...props }: NeedleValveProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createNeedleValveGeom(props)} />
    </Colorize>
  )
}
