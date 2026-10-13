import type { ClevisModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createClevisGeom } from "./geometry"
export type ClevisProps = ClevisModelPropsInput & { color?: string }
export function Clevis({ color = "#929da9", ...props }: ClevisProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createClevisGeom(props)} />
    </Colorize>
  )
}
