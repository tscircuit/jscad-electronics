import type { RoundBarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRoundBarGeom } from "./geometry"
export type RoundBarProps = RoundBarModelPropsInput & { color?: string }
export function RoundBar({ color = "#929da9", ...props }: RoundBarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRoundBarGeom(props)} />
    </Colorize>
  )
}
