import type { RectangularGasketModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRectangularGasketGeom } from "./geometry"
export type RectangularGasketProps = RectangularGasketModelPropsInput & {
  color?: string
}
export function RectangularGasket({
  color = "#394553",
  ...props
}: RectangularGasketProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRectangularGasketGeom(props)} />
    </Colorize>
  )
}
