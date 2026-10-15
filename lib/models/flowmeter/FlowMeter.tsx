import type { FlowMeterModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createFlowMeterGeom } from "./geometry"
export type FlowMeterProps = FlowMeterModelPropsInput & { color?: string }
export function FlowMeter({ color = "#929da9", ...props }: FlowMeterProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlowMeterGeom(props)} />
    </Colorize>
  )
}
