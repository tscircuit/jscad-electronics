import type { LevelingFootModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createLevelingFootGeom } from "./geometry"
export type LevelingFootProps = LevelingFootModelPropsInput & { color?: string }
export function LevelingFoot({
  color = "#929da9",
  ...props
}: LevelingFootProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLevelingFootGeom(props)} />
    </Colorize>
  )
}
