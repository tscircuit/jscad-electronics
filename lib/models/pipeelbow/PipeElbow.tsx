import type { PipeElbowModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeElbowGeom } from "./geometry"
export type PipeElbowProps = PipeElbowModelPropsInput & { color?: string }
export function PipeElbow({ color = "#87929f", ...props }: PipeElbowProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeElbowGeom(props)} />
    </Colorize>
  )
}
