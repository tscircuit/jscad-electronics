import type { GearRackModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createGearRackGeom } from "./geometry"
export type GearRackProps = GearRackModelPropsInput & { color?: string }
export function GearRack({ color = "#929da9", ...props }: GearRackProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createGearRackGeom(props)} />
    </Colorize>
  )
}
