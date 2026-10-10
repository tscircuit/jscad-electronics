import type { RectangularBarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRectangularBarGeom } from "./geometry"
export type RectangularBarProps = RectangularBarModelPropsInput & {
  color?: string
}
export function RectangularBar({
  color = "#929da9",
  ...props
}: RectangularBarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRectangularBarGeom(props)} />
    </Colorize>
  )
}
