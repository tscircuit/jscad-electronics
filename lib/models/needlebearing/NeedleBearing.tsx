import type { NeedleBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createNeedleBearingGeom } from "./geometry"
export type NeedleBearingProps = NeedleBearingModelPropsInput & {
  color?: string
}
export function NeedleBearing({
  color = "#929da9",
  ...props
}: NeedleBearingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createNeedleBearingGeom(props)} />
    </Colorize>
  )
}
