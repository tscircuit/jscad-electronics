import type { PottingBoxModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPottingBoxGeom } from "./geometry"
export type PottingBoxProps = PottingBoxModelPropsInput & { color?: string }
export function PottingBox({ color = "#52616e", ...props }: PottingBoxProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPottingBoxGeom(props)} />
    </Colorize>
  )
}
