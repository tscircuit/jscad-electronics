import type { PipeCouplingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeCouplingGeom } from "./geometry"
export type PipeCouplingProps = PipeCouplingModelPropsInput & { color?: string }
export function PipeCoupling({
  color = "#87929f",
  ...props
}: PipeCouplingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeCouplingGeom(props)} />
    </Colorize>
  )
}
