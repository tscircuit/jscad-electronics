import type { KeyWasherModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createKeyWasherGeom } from "./geometry"
export type KeyWasherProps = KeyWasherModelPropsInput & { color?: string }
export function KeyWasher({ color = "#394553", ...props }: KeyWasherProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createKeyWasherGeom(props)} />
    </Colorize>
  )
}
