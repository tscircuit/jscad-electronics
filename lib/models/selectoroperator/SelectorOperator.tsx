import type { SelectorOperatorModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSelectorOperatorGeom } from "./geometry"
export type SelectorOperatorProps = SelectorOperatorModelPropsInput & {
  color?: string
}
export function SelectorOperator({
  color = "#929da9",
  ...props
}: SelectorOperatorProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSelectorOperatorGeom(props)} />
    </Colorize>
  )
}
