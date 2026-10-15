import type { CompressionFittingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCompressionFittingGeom } from "./geometry"
export type CompressionFittingProps = CompressionFittingModelPropsInput & {
  color?: string
}
export function CompressionFitting({
  color = "#87929f",
  ...props
}: CompressionFittingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCompressionFittingGeom(props)} />
    </Colorize>
  )
}
