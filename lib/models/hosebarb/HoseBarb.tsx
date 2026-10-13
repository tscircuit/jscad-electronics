import type { HoseBarbModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHoseBarbGeom } from "./geometry"
export type HoseBarbProps = HoseBarbModelPropsInput & { color?: string }
export function HoseBarb({ color = "#87929f", ...props }: HoseBarbProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHoseBarbGeom(props)} />
    </Colorize>
  )
}
