import type { HoseClampModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHoseClampGeom } from "./geometry"
export type HoseClampProps = HoseClampModelPropsInput & { color?: string }
export function HoseClamp({ color = "#87929f", ...props }: HoseClampProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHoseClampGeom(props)} />
    </Colorize>
  )
}
