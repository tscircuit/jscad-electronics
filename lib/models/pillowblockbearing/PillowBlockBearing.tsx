import type { PillowBlockBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPillowBlockBearingGeom } from "./geometry"
export type PillowBlockBearingProps = PillowBlockBearingModelPropsInput & {
  color?: string
}
export function PillowBlockBearing({
  color = "#929da9",
  ...props
}: PillowBlockBearingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPillowBlockBearingGeom(props)} />
    </Colorize>
  )
}
