import type { HandwheelModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHandwheelGeom } from "./geometry"
export type HandwheelProps = HandwheelModelPropsInput & { color?: string }
export function Handwheel({ color = "#929da9", ...props }: HandwheelProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHandwheelGeom(props)} />
    </Colorize>
  )
}
