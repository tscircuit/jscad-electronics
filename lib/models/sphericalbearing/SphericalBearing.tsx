import type { SphericalBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSphericalBearingGeom } from "./geometry"
export type SphericalBearingProps = SphericalBearingModelPropsInput & {
  color?: string
}
export function SphericalBearing({
  color = "#929da9",
  ...props
}: SphericalBearingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSphericalBearingGeom(props)} />
    </Colorize>
  )
}
