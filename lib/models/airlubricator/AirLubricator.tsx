import type { AirLubricatorModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createAirLubricatorGeom } from "./geometry"
export type AirLubricatorProps = AirLubricatorModelPropsInput & {
  color?: string
}
export function AirLubricator({
  color = "#929da9",
  ...props
}: AirLubricatorProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createAirLubricatorGeom(props)} />
    </Colorize>
  )
}
