import type { SolenoidValveModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSolenoidValveGeom } from "./geometry"
export type SolenoidValveProps = SolenoidValveModelPropsInput & {
  color?: string
}
export function SolenoidValve({
  color = "#929da9",
  ...props
}: SolenoidValveProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSolenoidValveGeom(props)} />
    </Colorize>
  )
}
