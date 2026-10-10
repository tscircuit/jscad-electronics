import type { PerforatedSheetModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPerforatedSheetGeom } from "./geometry"
export type PerforatedSheetProps = PerforatedSheetModelPropsInput & {
  color?: string
}
export function PerforatedSheet({
  color = "#929da9",
  ...props
}: PerforatedSheetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPerforatedSheetGeom(props)} />
    </Colorize>
  )
}
