import type { RodEndModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRodEndGeom } from "./geometry"
export type RodEndProps = RodEndModelPropsInput & { color?: string }
export function RodEnd({ color = "#929da9", ...props }: RodEndProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRodEndGeom(props)} />
    </Colorize>
  )
}
