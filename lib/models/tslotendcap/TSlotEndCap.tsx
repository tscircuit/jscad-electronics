import type { TSlotEndCapModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createTSlotEndCapGeom } from "./geometry"
export type TSlotEndCapProps = TSlotEndCapModelPropsInput & { color?: string }
export function TSlotEndCap({ color = "#465564", ...props }: TSlotEndCapProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotEndCapGeom(props)} />
    </Colorize>
  )
}
