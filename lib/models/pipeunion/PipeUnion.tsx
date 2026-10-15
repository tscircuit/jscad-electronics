import type { PipeUnionModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeUnionGeom } from "./geometry"
export type PipeUnionProps = PipeUnionModelPropsInput & { color?: string }
export function PipeUnion({ color = "#87929f", ...props }: PipeUnionProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeUnionGeom(props)} />
    </Colorize>
  )
}
