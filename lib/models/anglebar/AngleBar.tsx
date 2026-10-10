import type { AngleBarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createAngleBarGeom } from "./geometry"
export type AngleBarProps = AngleBarModelPropsInput & { color?: string }
export function AngleBar({ color = "#929da9", ...props }: AngleBarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createAngleBarGeom(props)} />
    </Colorize>
  )
}
