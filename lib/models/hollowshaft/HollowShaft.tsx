import type { HollowShaftModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHollowShaftGeom } from "./geometry"
export type HollowShaftProps = HollowShaftModelPropsInput & { color?: string }
export function HollowShaft({ color = "#929da9", ...props }: HollowShaftProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHollowShaftGeom(props)} />
    </Colorize>
  )
}
