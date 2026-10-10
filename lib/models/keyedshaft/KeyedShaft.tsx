import type { KeyedShaftModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createKeyedShaftGeom } from "./geometry"
export type KeyedShaftProps = KeyedShaftModelPropsInput & { color?: string }
export function KeyedShaft({ color = "#929da9", ...props }: KeyedShaftProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createKeyedShaftGeom(props)} />
    </Colorize>
  )
}
