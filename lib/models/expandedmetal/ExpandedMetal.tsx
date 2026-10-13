import type { ExpandedMetalModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createExpandedMetalGeom } from "./geometry"
export type ExpandedMetalProps = ExpandedMetalModelPropsInput & {
  color?: string
}
export function ExpandedMetal({
  color = "#929da9",
  ...props
}: ExpandedMetalProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createExpandedMetalGeom(props)} />
    </Colorize>
  )
}
