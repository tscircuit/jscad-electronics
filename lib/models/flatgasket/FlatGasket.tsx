import type { FlatGasketModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createFlatGasketGeom } from "./geometry"
export type FlatGasketProps = FlatGasketModelPropsInput & { color?: string }
export function FlatGasket({ color = "#394553", ...props }: FlatGasketProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlatGasketGeom(props)} />
    </Colorize>
  )
}
