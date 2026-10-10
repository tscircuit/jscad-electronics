import type { CableClampModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCableClampGeom } from "./geometry"
export type CableClampProps = CableClampModelPropsInput & { color?: string }
export function CableClamp({ color = "#7b8796", ...props }: CableClampProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCableClampGeom(props)} />
    </Colorize>
  )
}
