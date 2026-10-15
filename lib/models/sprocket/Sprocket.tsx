import type { SprocketModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSprocketGeom } from "./geometry"
export type SprocketProps = SprocketModelPropsInput & { color?: string }
export function Sprocket({ color = "#929da9", ...props }: SprocketProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSprocketGeom(props)} />
    </Colorize>
  )
}
