import type { LeverHandleModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createLeverHandleGeom } from "./geometry"
export type LeverHandleProps = LeverHandleModelPropsInput & { color?: string }
export function LeverHandle({ color = "#929da9", ...props }: LeverHandleProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLeverHandleGeom(props)} />
    </Colorize>
  )
}
