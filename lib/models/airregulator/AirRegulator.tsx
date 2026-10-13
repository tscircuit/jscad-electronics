import type { AirRegulatorModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createAirRegulatorGeom } from "./geometry"
export type AirRegulatorProps = AirRegulatorModelPropsInput & { color?: string }
export function AirRegulator({
  color = "#929da9",
  ...props
}: AirRegulatorProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createAirRegulatorGeom(props)} />
    </Colorize>
  )
}
