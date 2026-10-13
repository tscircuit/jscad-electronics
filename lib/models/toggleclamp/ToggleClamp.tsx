import type { ToggleClampModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createToggleClampGeom } from "./geometry"
export type ToggleClampProps = ToggleClampModelPropsInput & { color?: string }
export function ToggleClamp({ color = "#929da9", ...props }: ToggleClampProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createToggleClampGeom(props)} />
    </Colorize>
  )
}
