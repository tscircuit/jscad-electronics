import type { BulkheadFittingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createBulkheadFittingGeom } from "./geometry"
export type BulkheadFittingProps = BulkheadFittingModelPropsInput & {
  color?: string
}
export function BulkheadFitting({
  color = "#87929f",
  ...props
}: BulkheadFittingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBulkheadFittingGeom(props)} />
    </Colorize>
  )
}
