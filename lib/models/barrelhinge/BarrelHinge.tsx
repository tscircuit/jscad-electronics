import type { BarrelHingeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createBarrelHingeGeom } from "./geometry"
export type BarrelHingeProps = BarrelHingeModelPropsInput & { color?: string }
export function BarrelHinge({ color = "#929da9", ...props }: BarrelHingeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBarrelHingeGeom(props)} />
    </Colorize>
  )
}
