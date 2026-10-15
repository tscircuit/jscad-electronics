import type { StarKnobModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createStarKnobGeom } from "./geometry"
export type StarKnobProps = StarKnobModelPropsInput & { color?: string }
export function StarKnob({ color = "#929da9", ...props }: StarKnobProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createStarKnobGeom(props)} />
    </Colorize>
  )
}
