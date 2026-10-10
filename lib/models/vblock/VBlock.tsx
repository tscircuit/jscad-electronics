import type { VBlockModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createVBlockGeom } from "./geometry"
export type VBlockProps = VBlockModelPropsInput & { color?: string }
export function VBlock({ color = "#929da9", ...props }: VBlockProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createVBlockGeom(props)} />
    </Colorize>
  )
}
