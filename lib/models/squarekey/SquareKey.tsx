import type { SquareKeyModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSquareKeyGeom } from "./geometry"
export type SquareKeyProps = SquareKeyModelPropsInput & { color?: string }
export function SquareKey({ color = "#929da9", ...props }: SquareKeyProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSquareKeyGeom(props)} />
    </Colorize>
  )
}
