import type { CasterModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCasterGeom } from "./geometry"
export type CasterProps = CasterModelPropsInput & { color?: string }
export function Caster({ color = "#929da9", ...props }: CasterProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCasterGeom(props)} />
    </Colorize>
  )
}
