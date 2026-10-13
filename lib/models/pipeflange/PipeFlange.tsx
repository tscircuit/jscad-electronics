import type { PipeFlangeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeFlangeGeom } from "./geometry"
export type PipeFlangeProps = PipeFlangeModelPropsInput & { color?: string }
export function PipeFlange({ color = "#87929f", ...props }: PipeFlangeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeFlangeGeom(props)} />
    </Colorize>
  )
}
