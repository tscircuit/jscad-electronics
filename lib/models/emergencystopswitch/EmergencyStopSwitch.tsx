import type { EmergencyStopSwitchModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createEmergencyStopSwitchGeom } from "./geometry"
export type EmergencyStopSwitchProps = EmergencyStopSwitchModelPropsInput & {
  color?: string
}
export function EmergencyStopSwitch({
  color = "#929da9",
  ...props
}: EmergencyStopSwitchProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createEmergencyStopSwitchGeom(props)} />
    </Colorize>
  )
}
