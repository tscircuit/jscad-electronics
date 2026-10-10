import type { PcbCornerClipModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPcbCornerClipGeom } from "./geometry"
export type PcbCornerClipProps = PcbCornerClipModelPropsInput & {
  color?: string
}
export function PcbCornerClip({
  color = "#52616e",
  ...props
}: PcbCornerClipProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPcbCornerClipGeom(props)} />
    </Colorize>
  )
}
