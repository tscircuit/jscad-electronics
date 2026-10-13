import type { VGrooveWheelModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createVGrooveWheelGeom } from "./geometry"
export type VGrooveWheelProps = VGrooveWheelModelPropsInput & { color?: string }
export function VGrooveWheel({
  color = "#929da9",
  ...props
}: VGrooveWheelProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createVGrooveWheelGeom(props)} />
    </Colorize>
  )
}
