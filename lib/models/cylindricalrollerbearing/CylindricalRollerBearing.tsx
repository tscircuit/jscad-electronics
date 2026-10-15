import type { CylindricalRollerBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCylindricalRollerBearingGeom } from "./geometry"
export type CylindricalRollerBearingProps =
  CylindricalRollerBearingModelPropsInput & { color?: string }
export function CylindricalRollerBearing({
  color = "#929da9",
  ...props
}: CylindricalRollerBearingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCylindricalRollerBearingGeom(props)} />
    </Colorize>
  )
}
