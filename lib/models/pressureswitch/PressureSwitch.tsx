import type { PressureSwitchModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPressureSwitchGeom } from "./geometry"
export type PressureSwitchProps = PressureSwitchModelPropsInput & {
  color?: string
}
export function PressureSwitch({
  color = "#929da9",
  ...props
}: PressureSwitchProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPressureSwitchGeom(props)} />
    </Colorize>
  )
}
