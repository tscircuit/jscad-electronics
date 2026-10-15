import type { PipePlugModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipePlugGeom } from "./geometry"
export type PipePlugProps = PipePlugModelPropsInput & { color?: string }
export function PipePlug({ color = "#87929f", ...props }: PipePlugProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipePlugGeom(props)} />
    </Colorize>
  )
}
