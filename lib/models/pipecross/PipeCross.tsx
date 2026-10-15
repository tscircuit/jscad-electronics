import type { PipeCrossModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPipeCrossGeom } from "./geometry"
export type PipeCrossProps = PipeCrossModelPropsInput & { color?: string }
export function PipeCross({ color = "#87929f", ...props }: PipeCrossProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPipeCrossGeom(props)} />
    </Colorize>
  )
}
