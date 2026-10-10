import type { CornerFootModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCornerFootGeom } from "./geometry"
export type CornerFootProps = CornerFootModelPropsInput & { color?: string }
export function CornerFoot({ color = "#394553", ...props }: CornerFootProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCornerFootGeom(props)} />
    </Colorize>
  )
}
