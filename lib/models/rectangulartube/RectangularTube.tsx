import type { RectangularTubeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRectangularTubeGeom } from "./geometry"
export type RectangularTubeProps = RectangularTubeModelPropsInput & {
  color?: string
}
export function RectangularTube({
  color = "#929da9",
  ...props
}: RectangularTubeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRectangularTubeGeom(props)} />
    </Colorize>
  )
}
