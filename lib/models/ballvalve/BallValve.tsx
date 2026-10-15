import type { BallValveModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createBallValveGeom } from "./geometry"
export type BallValveProps = BallValveModelPropsInput & { color?: string }
export function BallValve({ color = "#87929f", ...props }: BallValveProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBallValveGeom(props)} />
    </Colorize>
  )
}
