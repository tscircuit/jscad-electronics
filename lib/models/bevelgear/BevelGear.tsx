import type { BevelGearModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createBevelGearGeom } from "./geometry"
export type BevelGearProps = BevelGearModelPropsInput & { color?: string }
export function BevelGear({ color = "#929da9", ...props }: BevelGearProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBevelGearGeom(props)} />
    </Colorize>
  )
}
