import type { TerminalBlockModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createTerminalBlockGeom } from "./geometry"
export type TerminalBlockProps = TerminalBlockModelPropsInput & {
  color?: string
}
export function TerminalBlock({
  color = "#929da9",
  ...props
}: TerminalBlockProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTerminalBlockGeom(props)} />
    </Colorize>
  )
}
