import type { SplitGrommetModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSplitGrommetGeom } from "./geometry"
export type SplitGrommetProps = SplitGrommetModelPropsInput & { color?: string }
export function SplitGrommet({
  color = "#394553",
  ...props
}: SplitGrommetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSplitGrommetGeom(props)} />
    </Colorize>
  )
}
