import type { PipeNippleModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeNippleGeom } from "./geometry"
export type PipeNippleProps = PipeNippleModelPropsInput & { color?: string }
export function PipeNipple({ color = "#87929f", ...props }: PipeNippleProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeNippleGeom(props)} />
    </Colorize>
  )
}
