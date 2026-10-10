import type { CableTieBaseModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCableTieBaseGeom } from "./geometry"
export type CableTieBaseProps = CableTieBaseModelPropsInput & { color?: string }
export function CableTieBase({
  color = "#52616e",
  ...props
}: CableTieBaseProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCableTieBaseGeom(props)} />
    </Colorize>
  )
}
