import type { CoolingFanModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCoolingFanGeom } from "./geometry"
export type CoolingFanProps = CoolingFanModelPropsInput & { color?: string }
export function CoolingFan({ color = "#929da9", ...props }: CoolingFanProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCoolingFanGeom(props)} />
    </Colorize>
  )
}
