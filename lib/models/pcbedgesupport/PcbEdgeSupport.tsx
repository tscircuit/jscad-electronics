import type { PcbEdgeSupportModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPcbEdgeSupportGeom } from "./geometry"
export type PcbEdgeSupportProps = PcbEdgeSupportModelPropsInput & {
  color?: string
}
export function PcbEdgeSupport({
  color = "#465e72",
  ...props
}: PcbEdgeSupportProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPcbEdgeSupportGeom(props)} />
    </Colorize>
  )
}
