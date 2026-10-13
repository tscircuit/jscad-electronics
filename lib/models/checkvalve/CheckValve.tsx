import type { CheckValveModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCheckValveGeom } from "./geometry"
export type CheckValveProps = CheckValveModelPropsInput & { color?: string }
export function CheckValve({ color = "#87929f", ...props }: CheckValveProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCheckValveGeom(props)} />
    </Colorize>
  )
}
