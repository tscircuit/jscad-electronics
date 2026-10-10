import type { EdgeGrommetModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createEdgeGrommetGeom } from "./geometry"
export type EdgeGrommetProps = EdgeGrommetModelPropsInput & { color?: string }
export function EdgeGrommet({ color = "#465e72", ...props }: EdgeGrommetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createEdgeGrommetGeom(props)} />
    </Colorize>
  )
}
