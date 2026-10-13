import type { PipeCapModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeCapGeom } from "./geometry"
export type PipeCapProps = PipeCapModelPropsInput & { color?: string }
export function PipeCap({ color = "#87929f", ...props }: PipeCapProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeCapGeom(props)} />
    </Colorize>
  )
}
