import type { TeeBarModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createTeeBarGeom } from "./geometry"
export type TeeBarProps = TeeBarModelPropsInput & { color?: string }
export function TeeBar({ color = "#929da9", ...props }: TeeBarProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTeeBarGeom(props)} />
    </Colorize>
  )
}
