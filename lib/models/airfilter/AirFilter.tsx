import type { AirFilterModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createAirFilterGeom } from "./geometry"
export type AirFilterProps = AirFilterModelPropsInput & { color?: string }
export function AirFilter({ color = "#929da9", ...props }: AirFilterProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createAirFilterGeom(props)} />
    </Colorize>
  )
}
