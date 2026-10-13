import type { PneumaticCylinderModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPneumaticCylinderGeom } from "./geometry"
export type PneumaticCylinderProps = PneumaticCylinderModelPropsInput & {
  color?: string
}
export function PneumaticCylinder({
  color = "#929da9",
  ...props
}: PneumaticCylinderProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPneumaticCylinderGeom(props)} />
    </Colorize>
  )
}
