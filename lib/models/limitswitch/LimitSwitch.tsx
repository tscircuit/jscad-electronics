import type { LimitSwitchModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createLimitSwitchGeom } from "./geometry"
export type LimitSwitchProps = LimitSwitchModelPropsInput & { color?: string }
export function LimitSwitch({ color = "#929da9", ...props }: LimitSwitchProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLimitSwitchGeom(props)} />
    </Colorize>
  )
}
