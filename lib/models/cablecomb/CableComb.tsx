import type { CableCombModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCableCombGeom } from "./geometry"
export type CableCombProps = CableCombModelPropsInput & { color?: string }
export function CableComb({ color = "#465e72", ...props }: CableCombProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCableCombGeom(props)} />
    </Colorize>
  )
}
