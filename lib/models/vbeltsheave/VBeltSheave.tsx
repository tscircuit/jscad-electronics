import type { VBeltSheaveModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createVBeltSheaveGeom } from "./geometry"
export type VBeltSheaveProps = VBeltSheaveModelPropsInput & { color?: string }
export function VBeltSheave({ color = "#929da9", ...props }: VBeltSheaveProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createVBeltSheaveGeom(props)} />
    </Colorize>
  )
}
