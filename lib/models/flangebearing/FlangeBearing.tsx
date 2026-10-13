import type { FlangeBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createFlangeBearingGeom } from "./geometry"
export type FlangeBearingProps = FlangeBearingModelPropsInput & {
  color?: string
}
export function FlangeBearing({
  color = "#929da9",
  ...props
}: FlangeBearingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlangeBearingGeom(props)} />
    </Colorize>
  )
}
