import type { HingeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createHingeGeom } from "./geometry"
export type HingeProps = HingeModelPropsInput & { color?: string }
export function Hinge({ color = "#929da9", ...props }: HingeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHingeGeom(props)} />
    </Colorize>
  )
}
