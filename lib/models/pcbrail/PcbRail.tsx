import type { PcbRailModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPcbRailGeom } from "./geometry"
export type PcbRailProps = PcbRailModelPropsInput & { color?: string }
export function PcbRail({ color = "#52616e", ...props }: PcbRailProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPcbRailGeom(props)} />
    </Colorize>
  )
}
