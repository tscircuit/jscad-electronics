import type { DinRailModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createDinRailGeom } from "./geometry"
export type DinRailProps = DinRailModelPropsInput & { color?: string }
export function DinRail({ color = "#929da9", ...props }: DinRailProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createDinRailGeom(props)} />
    </Colorize>
  )
}
