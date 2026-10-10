import type { HexShaftModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHexShaftGeom } from "./geometry"
export type HexShaftProps = HexShaftModelPropsInput & { color?: string }
export function HexShaft({ color = "#929da9", ...props }: HexShaftProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHexShaftGeom(props)} />
    </Colorize>
  )
}
