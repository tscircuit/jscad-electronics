import type { PipeTeeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeTeeGeom } from "./geometry"
export type PipeTeeProps = PipeTeeModelPropsInput & { color?: string }
export function PipeTee({ color = "#87929f", ...props }: PipeTeeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeTeeGeom(props)} />
    </Colorize>
  )
}
