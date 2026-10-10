import type { TSlotCoverStripModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createTSlotCoverStripGeom } from "./geometry"
export type TSlotCoverStripProps = TSlotCoverStripModelPropsInput & {
  color?: string
}
export function TSlotCoverStrip({
  color = "#465564",
  ...props
}: TSlotCoverStripProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotCoverStripGeom(props)} />
    </Colorize>
  )
}
