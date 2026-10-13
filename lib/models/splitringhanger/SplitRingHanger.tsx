import type { SplitRingHangerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSplitRingHangerGeom } from "./geometry"
export type SplitRingHangerProps = SplitRingHangerModelPropsInput & {
  color?: string
}
export function SplitRingHanger({
  color = "#929da9",
  ...props
}: SplitRingHangerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSplitRingHangerGeom(props)} />
    </Colorize>
  )
}
